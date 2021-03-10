export interface Foto{
    idFoto: number,
    nombre: string,
    pathFoto: string,
    perfilActual?: boolean,
    idAlbum: number,
}

export interface FotoI{
    nombre: string,
    idAlbum: number,
    pathFoto: string
}