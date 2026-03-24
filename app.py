from flask import Flask, render_template

app = Flask(__name__)


# -----------------------------
# Main Pages
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html", page_title="EMIS | Home", current_page="home") 


@app.route("/about")
def about():
    return render_template( "about.html",  page_title="About EMIS", current_page="about" )


@app.route("/contact")
def contact():
    return render_template( "contact.html",   page_title="Contact EMIS", current_page="contact" )


@app.route("/programs")
def programs():
    return render_template( "courses.html", page_title="Our Programs", current_page="programs")


@app.route("/staff")
def staff():
    return render_template( "team.html", page_title="Our Staff", current_page="staff")


@app.route("/testimonials")
def testimonials():
    return render_template("testimonial.html", page_title="Testimonials", current_page="testimonials" )


@app.route("/404")
def page_404():
    return render_template( "404.html", page_title="Page Not Found", current_page="404"), 404


@app.route("/culture")
def culture():
    return render_template("culture.html", page_title="EMIS Cultural Day", current_page="culture")


@app.route("/independence")
def independence():
    return render_template("independence.html", page_title="EMIS Independence Day", current_page="independence")

# -----------------------------
# Error Handlers
# -----------------------------
@app.errorhandler(404)
def not_found(error):
    return render_template("404.html", page_title="Page Not Found", current_page="404"), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)