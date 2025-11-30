#pip install  Flask Flask-MySQLdb werkzeug
from flask import Flask, request, session, redirect, url_for, render_template
from werkzeug.security import generate_password_hash, check_password_hash 
import pymysql
import os

# --- Configuración de Flask ---
app = Flask(__name__)
# Usa variable de entorno en producción
app.secret_key = os.environ.get('SECRET_KEY', '3bcbdeba836860774336fba79ed55026248690cddb6c3b6fc18b01c8d0538a13')

# --- Configuración de Conexión a DB ---
def conectar():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        db="guia",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

# --- Rutas de Navegación Básica ---
@app.route("/")
def index():
    return render_template("index/index.html") 

@app.route('/register')
def register():
    error_message = session.pop('error_register', None)
    return render_template('registro/register.html', error=error_message)

@app.route("/perfil")
def perfil():
    return render_template("perfil/perfilUsuario.html") 

@app.route("/olvidar_contraseña")
def olvidarcontraseña():
    return render_template("cont/contr.html")

@app.route("/creacion")
def creacion():
    return render_template("complements/creacion.html")

@app.route("/modulouno")
def modulouno():
    return render_template("moduloone/moduloone.html")

@app.route('/session')

def session_page():
    error_message = session.pop('error_login', None)
    
    if 'usuario_id' in session:
        return redirect(url_for('dashboard')) 
    
    return render_template('login/session.html', error=error_message) 

# --- Proceso de Registro ---
@app.route('/register_submit', methods=['POST'])
def register_submit():
    nombre = request.form.get('frmUsuario')
    correo = request.form.get('frmCuentaCorreo')
    contra = request.form.get('frmContraseña') 
    semestre = request.form.get('frmSemestre')
    grupo = request.form.get('frmGrupo')
    turno = request.form.get('frmTurno')
    especialidad = request.form.get('frmEspecialidad')

    if not all([nombre, correo, contra]):
        session['error_register'] = "Faltan datos obligatorios para el registro"
        return redirect(url_for('register'))

    contraseña_hasheada = generate_password_hash(contra) 

    conexion = conectar()
    try:
        with conexion.cursor() as cursor:
            # Verificar si el correo ya existe
            sql_check = "SELECT id_usuario FROM usuarios WHERE correo = %s"
            cursor.execute(sql_check, (correo,))
            if cursor.fetchone():
                session['error_register'] = "El correo ya está registrado. Intenta iniciar sesión."
                return redirect(url_for('register'))
            
            # Registrar al nuevo usuario
            sql_insert = """
                INSERT INTO usuarios 
                (nombre, correo, contra, semestre, grupo, turno, especialidad) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_insert, (nombre, correo, contraseña_hasheada, semestre, grupo, turno, especialidad))
        
        conexion.commit()
        session['success_register'] = "Registro exitoso. Inicia sesión con tus credenciales."
        return redirect(url_for('session_page')) 

    except pymysql.MySQLError as e:
        print(f"Error de base de datos durante el registro: {e}")
        session['error_register'] = "Ocurrió un error al registrar el usuario."
        return redirect(url_for('register'))

    finally:
        conexion.close()

# --- Proceso de Inicio de Sesión ---
@app.route('/login', methods=['POST'])
def login():
    correo = request.form.get('frmCuentaCorreo') 
    contra_plana = request.form.get('frmContraseña') 
    
    if not correo or not contra_plana:
        session['error_login'] = "Faltan datos de usuario o contraseña"
        return redirect(url_for('session_page'))

    conexion = conectar()
    try:
        with conexion.cursor() as cursor:
            # SELECT con el campo correcto: id_usuario
            sql = "SELECT id_usuario, nombre, contra FROM usuarios WHERE correo = %s"
            cursor.execute(sql, (correo,))
            usuario = cursor.fetchone() 

        if usuario:
            hash_guardado = usuario['contra']
            if check_password_hash(hash_guardado, contra_plana):
                # Usar 'id_usuario' que es el campo real de tu tabla
                session['usuario_id'] = usuario['id_usuario']
                session['nombre'] = usuario['nombre']
                return redirect(url_for('dashboard'))
            else:
                session['error_login'] = "Correo o contraseña incorrectos"
                return redirect(url_for('session_page'))
        else:
            session['error_login'] = "Correo o contraseña incorrectos"
            return redirect(url_for('session_page'))
            
    except pymysql.MySQLError as e:
        print(f"Error de base de datos durante el login: {e}")
        session['error_login'] = "Ocurrió un error en el servidor. Intenta de nuevo más tarde."
        return redirect(url_for('session_page'))

    finally:
        conexion.close() 

# --- RUTA PROTEGIDA (Dashboard) ---
@app.route('/dashboard')
def dashboard():
    if 'usuario_id' in session:
        return render_template('curso/dashboard.html', nombre_usuario=session['nombre'])
    else:
        return redirect(url_for('session_page')) 

# --- Cerrar Sesión ---
@app.route('/logout')
def logout():
    session.pop('usuario_id', None)
    session.pop('nombre', None)
    return redirect(url_for('session_page'))

# --- Ejecución ---
if __name__ == '__main__':
    app.run("0.0.0.0", 5000, debug=True)