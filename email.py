app.py

from flask import Flask, request
import uuid
from datetime import datetime, timedelta
from your_db_models import User, PasswordReset, db

app = Flask(__name__)

@app.post("/request-reset")
def request_reset():
    email = request.form["email"]
    user = User.query.filter_by(email=email).first()

    if not user:
        return "Si el correo existe, se enviará un mensaje.", 200

    token = str(uuid.uuid4())
    expires = datetime.utcnow() + timedelta(minutes=30)

    reset = PasswordReset(user_id=user.id, token=token, expires_at=expires)
    db.session.add(reset)
    db.session.commit()


    enviar_correo(user.email, f"https://tuweb.com/reset-password?token={token}")

    return "Revisa tu correo."

@app.post("/reset-password")
def reset_password():
    token = request.args.get("token")
    new_pass = request.form["password"]

    reset = PasswordReset.query.filter_by(token=token).first()
    if not reset or reset.expires_at < datetime.utcnow():
        return "Token inválido o expirado.", 400

    user = User.query.get(reset.user_id)
    user.password = hash_pass(new_pass)

    db.session.delete(reset)
    db.session.commit()

    return "Contraseña cambiada con éxito."
