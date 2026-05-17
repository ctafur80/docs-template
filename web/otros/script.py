#!/usr/bin/env python3

import shutil
import subprocess
from pathlib import Path

def limpiar_y_copiar():
    print("Iniciando script de preparación...")

    # 1. Comprobar y eliminar varios directorios.
    for nombre_dir in ['.git', 'pandoc']:
        git_dir = Path(nombre_dir)
        if git_dir.is_dir():
            try:
                shutil.rmtree(git_dir) 
                # He quitado el '$' que tenías en el print para que no salga '$.git'
                print(f"🗑️ Directorio '{nombre_dir}' encontrado y eliminado.")
            except Exception as e:
                print(f"❌ Error al eliminar '{nombre_dir}': {e}")

    # 2. Comprobar y eliminar varios archivos (Corregido 'defaults' por 'defaults.yaml')
    for nombre_archivo in ['.gitmodules', '.gitmodule', 'pandoc-settings.yaml', 'defaults.yaml']:
        git_file = Path(nombre_archivo)
        # Usamos is_file() o is_symlink() para atrapar el enlace simbólico roto
        if git_file.is_file() or git_file.is_symlink():
            try:
                git_file.unlink() 
                print(f"🗑️ Archivo/Enlace '{nombre_archivo}' encontrado y eliminado.")
            except Exception as e:
                print(f"❌ Error al eliminar '{nombre_archivo}': {e}")

    # 3. Copiar usando Python puro
    print("⏳ Intentando copiar el archivo de ajustes...")
    archivo_origen = Path("../asterisk/pandoc-defaults.yaml")
    archivo_destino = Path("pandoc-defaults.yaml")

    if archivo_origen.exists():
        try:
            shutil.copy2(archivo_origen, archivo_destino)
            print("✅ Archivo 'pandoc-defaults.yaml' copiado correctamente.")
        except PermissionError:
            print("❌ Error de permisos: No tienes acceso para leer el origen o escribir.")
        except Exception as e:
            print(f"❌ Error inesperado al copiar: {e}")
    else:
        print(f"❌ Error: El archivo origen no existe en: {archivo_origen.resolve()}")

    # 4. Ejecutar Pandoc
    print("⏳ Ejecutando comando de generación del documento de salida...")
    try:
        subprocess.run(["pandoc", "--defaults", "pandoc-defaults.yaml"], check=True)
        print("✅ Documento generado por Pandoc.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Pandoc falló con el código de error: {e.returncode}")

    # 5. Iniciar el nuevo repositorio Git
    print("⏳ Iniciando el nuevo repositorio de Git...")
    try:
        subprocess.run(["git", "init"], check=True)
        print("✅ Repositorio Git inicializado.")
    except subprocess.CalledProcessError as e:
        print(f"❌ 'git init' falló con el código: {e.returncode}")

    # 6. Añadir y hacer commit
    print("⏳ Añadiendo a staging y haciendo el primer commit...")
    try:
        subprocess.run(["git", "add", "--all"], check=True)
        subprocess.run(["git", "commit", "-m", "Primer commit."], check=True)
        print("✅ Primer commit realizado con éxito.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Los comandos finales de Git fallaron con el código: {e.returncode}")

if __name__ == "__main__":
    limpiar_y_copiar()
