# Universidad de San Carlos de Guatemala
# Facultad de Ingeniería
# Seminario de Sistemas 1 - Práctica 1
# Alumnos
* 201700529 - Cristian Manasés Juárez
* 201403767 - Pablo David Ramírez Fernández

# Arquitectura
![image](https://user-images.githubusercontent.com/66462044/110421916-01c98100-8064-11eb-89de-21369fa3aabb.png)
## AppWeb Publica
<p> Para construir el FrontEnd se utilizón Angular y se cargó en un Bucket S3.
El tráfico es distribuido por un load balancer hacía los servidores NodeJs y Python </p>

## Servidores
<p> Se utilizan dos servidores uno en lenguaje NodeJS y un segundo con Python ambos corriendo en una instancia
 EC2 de Amazon, que reciben el tráfico traído por el load balancer.</p>
 
 ![image](https://user-images.githubusercontent.com/66462044/110422231-9207c600-8064-11eb-977d-ed5f6637ce2a.png)

 ## Base de datos
 <p> Para almacenar la información se utiliza un base de datos relacional en MySQL.  Para ello se utilizó el siguiente diagrama conceptual  </p>

![Logical](https://user-images.githubusercontent.com/66462044/110420845-d5ad0080-8061-11eb-83c1-d1d0db583593.png)

 

 ## Bucket de imagenes
 <p> Adicionalmente a la base de datos se utiliza un Bucket s3 para almacenar imagenes como objetos. Carpetas para el almacenamiento de las imagenes.  </p>
 
 ![image](https://user-images.githubusercontent.com/66462044/110421024-3dfbe200-8062-11eb-8fbb-9d5069791edf.png)


# Usuarios IAM
![Captura de pantalla de 2021-03-08 23-23-12](https://user-images.githubusercontent.com/26152490/110422621-56213080-8065-11eb-96be-4065766ad4d6.png)

### USUARIO EC2
Configuración de sus politicas de fullAccesEc2

### USUARIO EC2
Configuración de sus politicas de fullAccesEc2

### USUARIO RDS
Configuración de sus politicas de fullAccesRDS
### USUARIO S3
Configuración de sus politicas de fullAccesS3

### USUARIO Security Group
Configuración de sus politicas de Security

# Aplicacion 
## Login
![Captura de pantalla de 2021-03-08 23-19-23](https://user-images.githubusercontent.com/26152490/110422389-e14df680-8064-11eb-85ab-45a16ee83143.png)

## Ver fotos
![Captura de pantalla de 2021-03-08 23-19-09](https://user-images.githubusercontent.com/26152490/110422394-e4e17d80-8064-11eb-98d2-2926520055d8.png)

## Subir una foto
![Captura de pantalla de 2021-03-08 23-18-53](https://user-images.githubusercontent.com/26152490/110422399-e743d780-8064-11eb-8fb9-17de68f1390e.png)


