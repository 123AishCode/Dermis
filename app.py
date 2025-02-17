import os
from flask import Flask, render_template, send_from_directory

# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Add template folder configuration
app.template_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app.static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/404')
@app.errorhandler(404)
def page_not_found(e=None):
    return render_template('404.html'), 404 if e else 200

# Serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == "__main__":
    # Ensure static folder exists
    os.makedirs(app.static_folder, exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
