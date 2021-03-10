from flask import Flask, request, jsonify, make_response
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import funcfilter
from flask_cors import CORS
from sqlalchemy import func
import hashlib
import json
import boto3
import base64
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)


s3 = boto3.resource('s3')

class Foto(db.Model):
    idFoto= db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(75))
    pathFoto = db.Column(db.String(200))
    perfilActual = db.Column(db.Boolean)
    idAlbum = db.Column(db.Integer, db.ForeignKey('album.idAlbum'))
    def __init__(self, nombre, pathFoto, perfilActual, idAlbum):
        self.nombre = nombre
        self.pathFoto = pathFoto
        self.perfilActual = perfilActual
        self.idAlbum = idAlbum

class Album(db.Model):
    idAlbum = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario'))
    def __init__(self, nombre, idUsuario):
        self.nombre = nombre
        self.idUsuario = idUsuario

class Usuario(db.Model):
    idUsuario = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(70), unique=True)
    nombre = db.Column(db.String(100))
    password = db.Column(db.String(100))

    def __init__(self, userName, nombre, password):
        self.userName = userName
        self.nombre = nombre
        self.password = password


class UsuarioSchema(ma.Schema):
    class Meta:
        fields = ('idUsuario', 'userName', 'nombre', 'password')

class AlbumSchema(ma.Schema):
    class Meta:
        fields = ('idAlbum', 'nombre', 'idUsuario')

class FotoSchema(ma.Schema):
    class Meta:
        fields = ('idFoto', 'nombre', 'pathFoto', 'perfilActual', 'idAlbum')

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

album_schema = AlbumSchema()
albunes_schema = AlbumSchema(many=True)

foto_schema = FotoSchema()
fotos_schema = FotoSchema(many=True)

@app.route('/usuarios', methods=['GET'])
def get_tasks():
    all_tasks = Usuario.query.all()
    result = usuarios_schema.dump(all_tasks)
    return jsonify(result)

@app.route('/login', methods=['POST'])
def login():
    userName = request.json['userName']
    password = request.json['password']
    result   = Usuario.query.filter(Usuario.userName == func.binary(userName)).first()
    print('*********sdfdsfsd  ',userName)
    #result = Usuario.query.filter(Usuario.userName.like(userName)).first()
    #response = usuario_schema.jsonify(result)  
    #print('************************************************', type(result),result.nombre)
    #result = Usuario.query.filter(Usuario.userName == func.binary(userName)).first()
    if not result:
        response = make_response(
                jsonify(
                    {"message": "no existe usuario"}
                ),
                401,
            )
        response.headers["Content-Type"] = "application/json"
    else:
        encryptPassword = hashlib.md5(password.encode()).hexdigest()
        if (encryptPassword == result.password):
            result = {"idUsuario": result.idUsuario, "userName": result.userName, "nombre": result.nombre}
            response = usuario_schema.jsonify(result)
        else:
            response = make_response(
                jsonify(
                    {"message": "password incorrecta"}
                ),
                402,
            )
            response.headers["Content-Type"] = "application/json"   
         

    return response

@app.route('/register', methods=['POST'])
def register():
    userName = request.json['userName']
    password = request.json['password']
    nombre   = request.json['nombre']
    imag     = request.json['imag']


    encryptPassword = hashlib.md5(password.encode()).hexdigest()
    new_usuario = Usuario(userName, nombre, encryptPassword)
    #print(new_usuario.password,' ',password,' ',imag)
    # guardar usuario
    db.session.add(new_usuario)

    #buscar username
    userFind   = Usuario.query.filter(Usuario.userName == func.binary(userName)).first()
    numRandom = (random.randint(300,500) + random.randint(0,100)) * 37
    idUsuario = userFind.idUsuario    

    #guardar album
    new_album = Album('perfil', idUsuario)
    db.session.add(new_album)
    #buscar album
    userFindAlbum  = Album.query.filter(Album.idUsuario == func.binary(idUsuario), Album.nombre.like ('perfil')).first()
    idAlbum = userFindAlbum.idAlbum
    print('*************qq', idAlbum) 

    image_base64 = imag
    bucket_name = 'practica1-g19-imagenes'

    file_name = 'Fotos_Perfil/img'+ str(numRandom) +'_perfil.jpg'
    
    try:       
        obj = s3.Object(bucket_name,file_name)
        obj.put(Body=base64.b64decode(image_base64))
        #response = s3_client.upload_file(base64.b64decode(base64_message), bucket_name, file_name)
        response = jsonify({
            "message": "Registro guardado"
        })
    except Exception as e:
        response = make_response(
                jsonify(
                    {"message": str(e)}
                ),
                400,
            )
        response.headers["Content-Type"] = "application/json"        
    
    #guardar foto
    nombreFoto = 'foto' + str(numRandom) + '_perfil'
    new_foto = Foto(nombreFoto , file_name, True, idAlbum )
    db.session.add(new_foto)
    

    
    db.session.commit()
    response = jsonify({
            "message": "Registro guardado"
        })
    return response

@app.route('/fotoPerfil/<id>', methods=['GET'])
def fotoPerfil(id):
    print('**********', id)
    albumPerfil   = Album.query.filter(Album.idUsuario == id, Album.nombre.like ('perfil')).first()
    fotoPerfil = Foto.query.filter(Foto.idAlbum == albumPerfil.idAlbum, Foto.perfilActual == True).first()
    result = foto_schema.jsonify(fotoPerfil)
    return result

@app.route('/editarPerfil', methods=['PUT'])
def editarPerfil():
    idUsuario = request.json['idUsuario']
    userName = request.json['userName']
    password = request.json['password']
    nombre   = request.json['nombre']
    imag     = request.json['imag']


    resultUser   = Usuario.query.get(idUsuario)
    encryptPassword = hashlib.md5(password.encode()).hexdigest()
    if (encryptPassword != resultUser.password):
        response = make_response(
            jsonify(
                {"message": "password incorrecta"}
            ),
            402,
        )
        response.headers["Content-Type"] = "application/json"
        return response

    # actualizar usuario
    Usuario.query.filter(Usuario.idUsuario == idUsuario).update({"userName": userName, "nombre": nombre})

    

    if imag != '':
        #numrandom
        numRandom = (random.randint(300,500) + random.randint(0,100)) * 37
        #buscar album
        userFindAlbum  = Album.query.filter(Album.idUsuario == func.binary(idUsuario), Album.nombre.like ('perfil')).first()
        idAlbum = userFindAlbum.idAlbum

        image_base64 = imag
        bucket_name = 'practica1-g19-imagenes'

        file_name = 'Fotos_Perfil/img'+ str(numRandom) +'_perfil.jpg'
    
        try:       
            obj = s3.Object(bucket_name,file_name)
            obj.put(Body=base64.b64decode(image_base64))
            #response = s3_client.upload_file(base64.b64decode(base64_message), bucket_name, file_name)
            response = jsonify({
                "message": "Registro guardado"
            })
        except Exception as e:
            response = make_response(
                    jsonify(
                        {"message": str(e)}
                    ),
                    400,
                )
            response.headers["Content-Type"] = "application/json"        
        #eliminar foto 
        Foto.query.filter(Foto.idAlbum == idAlbum, Foto.perfilActual == True).update({"perfilActual": False})

        #guardar foto
        nombreFoto = 'foto' + str(numRandom) + '_perfil'
        new_foto = Foto(nombreFoto , file_name, True, idAlbum )
        db.session.add(new_foto)

        
    
    db.session.commit()
    response = jsonify({
            "message": "Registro guardado"
        })
    return response


@app.route('/verificar-album', methods=['POST'])
def verificarAlbum():
    idUsuario = request.json['id_usuario']
    nombre   = request.json['nombre']
    album   = Album.query.filter(Album.idUsuario == idUsuario, Album.nombre == nombre).all()
    result = albunes_schema.dump(album)
    return jsonify(result)

@app.route('/crear-album', methods=['POST'])
def crearAlbum():
    idUsuario = request.json['id_usuario']
    nombre   = request.json['nombre']
    new_album = Album(nombre, idUsuario)
    db.session.add(new_album)

    db.session.commit()
    response = jsonify({
            "message": "Registro guardado"
        })
    return response

@app.route('/obteneralbumes/<id>', methods=['GET'])
def obtenerAlbumes(id):
    album   = Album.query.filter(Album.idUsuario == id, Album.nombre != 'perfil').all()
    result = albunes_schema.dump(album)
    return jsonify(result)


@app.route('/eliminar-album', methods=['POST'])
def eliminarAlbum():
    idAlbum = request.json['id_album']
    #eliminar Album 
    Foto.query.filter(Foto.idAlbum == idAlbum).delete()
    Album.query.filter(Album.idAlbum == idAlbum).delete()
    db.session.commit()
    response = jsonify({
            "message": "Album eliminado"
        })
    return response


@app.route('/foto', methods=['POST'])
def subirFoto():
    idAlbum = request.json['idAlbum']
    nombre   = request.json['nombre']
    pathFoto = request.json['pathFoto']

    #numrandom
    numRandom = (random.randint(300,500) + random.randint(0,100)) * 37
    #buscar album

    image_base64 = pathFoto
    bucket_name = 'practica1-g19-imagenes'

    file_name = 'Fotos_Publicadas/' + nombre + str(numRandom) +'.jpg'

    try:       
        obj = s3.Object(bucket_name,file_name)
        obj.put(Body=base64.b64decode(image_base64))
        #response = s3_client.upload_file(base64.b64decode(base64_message), bucket_name, file_name)
        response = jsonify({
            "message": "Registro guardado"
        })
    except Exception as e:
        response = make_response(
                jsonify(
                    {"message": str(e)}
                ),
                400,
            )
        response.headers["Content-Type"] = "application/json"        
    #eliminar foto 
    Foto.query.filter(Foto.idAlbum == idAlbum, Foto.perfilActual == True).update({"perfilActual": False})

    #guardar foto
    nombreFoto = nombre
    new_foto = Foto(nombreFoto , file_name, False, idAlbum )
    db.session.add(new_foto)


    db.session.commit()
    response = jsonify({
            "message": "Foto guardado"
        })
    return response

@app.route('/obtenerfotos/<id>', methods=['GET'])
def obtenerFotos(id):
    fotos  = Foto.query.filter(Foto.idAlbum == id).all()
    result = fotos_schema.dump(fotos)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
