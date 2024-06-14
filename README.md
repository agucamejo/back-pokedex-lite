# Backend of Pokedex Lite

The Pokedex Lite es una versión ligera del conocido Pokédex, desarrollada con React para el frontend, y Express, Node.js y MySQL para el backend.

## Funcionamiento de la Aplicación

### Login

La aplicación consta de un sistema de login en el que se corrobora si tienes un usuario creado o no. Los usuarios de desarrollo son:

-   **Usuario1**: `trainer`
    -   Contraseña: `password`
-   **Usuario2**: `master`
    -   Contraseña: `password`

### Características

1.  **Lista de Pokémon**:
    
    -   Si tienes un usuario creado, podrás ingresar a la lista de los Pokémon que tiene almacenados ese usuario.
    -   Podrás consultar la información detallada de cada Pokémon, incluyendo su nombre, tipo(s) y nivel.
    
2.  **Detalles del Pokémon**:
    
    -   Podrás ver los dos aspectos más importantes de un Pokémon específico: "Habilidades" y "Evolución".
    -   Para cada habilidad, se muestra el nombre y su descripción que el Pokémon posee.
    
3.  **Edición de Pokémon**:
    
    -   Podrás editar cualquier parte de la información de un Pokémon existente.
    
4.  **Creación de Pokémon**:
    
    -   Se permite la creación de un nuevo Pokémon en caso de encontrar uno.
  

## Configuración y Ejecución

  

### Clonar el Repositorio

```bash
git  clone  https://github.com/agucamejo/back-pokedex-lite.git

cd  back-pokedex-lite  
```

Instala  las  dependencias:

```bash
npm  install
```

Ejecuta  el  servidor:

```
npm  run  dev
```

El  servidor  se  ejecutará  en  http://localhost:4000,  y  desde  aquí  se  deben  hacer  las  peticiones  desde  el  frontend.

## Repositorio del Front-End 
Este proyecto se complementa con el [repositorio del front-end](https://github.com/agucamejo/pokedex-lite).

### Licencia

Este  proyecto  está  bajo  la  Licencia  MIT.