from flask import Flask, render_template, request, jsonify
from bot import EMISChatBot

app = Flask(__name__)

# -----------------------------
# Chatbot Setup
# -----------------------------
try:
    emis_bot = EMISChatBot()
    BOT_READY = True
    BOT_ERROR = None
except Exception as e:
    emis_bot = None
    BOT_READY = False
    BOT_ERROR = str(e)


# -----------------------------
# Main Pages
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html", page_title="Home", current_page="home")


@app.route("/about")
def about():
    return render_template("about.html", page_title="About EMIS", current_page="about")


@app.route("/contact")
def contact():
    return render_template("contact.html", page_title="Contact EMIS", current_page="contact")


@app.route("/programs")
def programs():
    return render_template("courses.html", page_title="Our Programs", current_page="programs")


@app.route("/staff")
def staff():
    return render_template("team.html", page_title="Our Staff", current_page="staff")


@app.route("/testimonials")
def testimonials():
    return render_template("testimonial.html", page_title="Testimonials", current_page="testimonials")


@app.route("/404")
def page_404():
    return render_template("404.html", page_title="Page Not Found", current_page="404"), 404


@app.route("/culture")
def culture():
    return render_template("culture.html", page_title="EMIS Cultural Day", current_page="culture")


@app.route("/independence")
def independence():
    return render_template("independence.html", page_title="EMIS Independence Day", current_page="independence")


@app.route("/sports")
def sports():
    return render_template("sports.html", page_title="EMIS Sports Day", current_page="sports")


@app.route("/walimah")
def walimah():
    return render_template("walimah.html", page_title="EMIS Walimah Ceremony", current_page="walimah")


@app.route("/founder")
def founder():
    return render_template("founder.html", page_title="EMIS Founder", current_page="founder")
<<<<<<< HEAD
    
=======


# -----------------------------
# Chatbot API
# -----------------------------
@app.route("/api/chat", methods=["POST"])
def api_chat():
    if not BOT_READY or emis_bot is None:
        return jsonify({
            "success": False,
            "reply": (
                "Sorry, the EMIS assistant is not available right now 😊\n\n"
                "Please contact us directly:\n"
                "📞 08054464613\n"
                "📞 08172022402\n"
                "📧 adetomi.epitomeschools@gmail.com"
            ),
            "error": BOT_ERROR
        }), 200

    try:
        data = request.get_json(silent=True) or {}
        message = (data.get("message") or "").strip()
        history = data.get("history") or []

        if not message:
            return jsonify({
                "success": False,
                "reply": "Please type a message first 😊"
            }), 400

        reply = emis_bot.answer(message, chat_history=history)

        return jsonify({
            "success": True,
            "reply": reply
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "reply": (
                "Sorry, something went wrong while processing your request 😊\n\n"
                "Please contact EMIS directly:\n"
                "📞 08054464613\n"
                "📞 08172022402\n"
                "📧 adetomi.epitomeschools@gmail.com"
            ),
            "error": str(e)
        }), 200


>>>>>>> develop
# -----------------------------
# Error Handlers
# -----------------------------
@app.errorhandler(404)
def not_found(error):
    return render_template("404.html", page_title="Page Not Found", current_page="404"), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)