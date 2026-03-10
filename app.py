from flask import Flask, render_template

app = Flask(__name__)

# -----------------------------
# Main Pages
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html", page_title="EMIS | Home")


@app.route("/about")
def about():
    return render_template("about.html", page_title="About EMIS")


@app.route("/contact")
def contact():
    return render_template("contact.html", page_title="Contact EMIS")


@app.route("/programs")
def programs():
    return render_template("courses.html", page_title="Our Programs")


@app.route("/staff")
def staff():
    return render_template("team.html", page_title="Our Staff")


@app.route("/testimonials")
def testimonials():
    return render_template("testimonial.html", page_title="Testimonials")


@app.route("/404")
def page_404():
    return render_template("404.html", page_title="Page Not Found"), 404


# -----------------------------
# Error Handlers
# -----------------------------
@app.errorhandler(404)
def not_found(error):
    return render_template("404.html", page_title="Page Not Found"), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)