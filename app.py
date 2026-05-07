import os
from flask import Flask, render_template, request, jsonify, Response
from dotenv import load_dotenv

from bot import EMISChatBot


# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()


# -----------------------------
# Flask App Setup
# -----------------------------
app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY", "emis_default_secret_key_change_this")


# -----------------------------
# Contact Details
# -----------------------------
EMIS_CONTACTS = {
    "eda": {
        "title": "EDA",
        "name": "Executive Director of Administration",
        "phone": "08172022401",
        "whatsapp": "2348172022401",
    },
    "edo": {
        "title": "EDO",
        "name": "Executive Director of Operations",
        "phone": "08054464613",
        "whatsapp": "2348054464613",
    },
    "dos": {
        "title": "DOS",
        "name": "Director of Studies",
        "phone": "08034486651",
        "whatsapp": "2348034486651",
    },
    "accountant": {
        "title": "School Accountant",
        "name": "Accounts and School Fees Enquiries",
        "phone": "08062277046",
        "whatsapp": "2348062277046",
    },
}

EMIS_EMAIL = "epitomeschools17@gmail.com"


def contact_fallback_message() -> str:
    return (
        "Sorry, the EMIS assistant is not available right now 😊\n\n"
        "Please contact EMIS directly:\n"
        "📞 EDA: 0817 202 2401\n"
        "📞 EDO: 0805 446 4613\n"
        "📞 DOS: 0803 448 6651\n"
        "📞 School Accountant: 0806 227 7046\n"
        f"📧 {EMIS_EMAIL}"
    )


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
    return render_template(
        "index.html",
        page_title="Epitome Model Islamic Schools | Nursery, Primary, Secondary & Tahfeez in Mararaba",
        current_page="home",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/about")
def about():
    return render_template(
        "about.html",
        page_title="About EMIS",
        current_page="about",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/contact")
def contact():
    return render_template(
        "contact.html",
        page_title="Contact EMIS",
        current_page="contact",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/programs")
def programs():
    return render_template(
        "courses.html",
        page_title="Our Programs",
        current_page="programs",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/staff")
def staff():
    return render_template(
        "team.html",
        page_title="Our Staff",
        current_page="staff",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/staffs")
def staffs():
    return render_template(
        "staffs.html",
        page_title="School Management",
        current_page="staffs",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/testimonials")
def testimonials():
    return render_template(
        "testimonial.html",
        page_title="Testimonials",
        current_page="testimonials",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/culture")
def culture():
    return render_template(
        "culture.html",
        page_title="EMIS Cultural Day",
        current_page="culture",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/independence")
def independence():
    return render_template(
        "independence.html",
        page_title="EMIS Independence Day",
        current_page="independence",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/sports")
def sports():
    return render_template(
        "sports.html",
        page_title="EMIS Sports Day",
        current_page="sports",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/walimah")
def walimah():
    return render_template(
        "walimah.html",
        page_title="EMIS Walimah Ceremony",
        current_page="walimah",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


@app.route("/founder")
def founder():
    return render_template(
        "founder.html",
        page_title="EMIS Founder",
        current_page="founder",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    )


# -----------------------------
# SEO Routes
# sitemap.xml and robots.txt
# -----------------------------
@app.route("/sitemap.xml")
def sitemap():
    sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://epitomeschools.com/</loc>
    <priority>1.00</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/about</loc>
    <priority>0.90</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/contact</loc>
    <priority>0.90</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/programs</loc>
    <priority>0.90</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/staffs</loc>
    <priority>0.85</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/founder</loc>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/culture</loc>
    <priority>0.75</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/independence</loc>
    <priority>0.75</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/sports</loc>
    <priority>0.75</priority>
  </url>

  <url>
    <loc>https://epitomeschools.com/walimah</loc>
    <priority>0.75</priority>
  </url>

</urlset>
"""
    return Response(sitemap_xml, mimetype="application/xml")


@app.route("/robots.txt")
def robots():
    robots_txt = """User-agent: *
Allow: /

Sitemap: https://epitomeschools.com/sitemap.xml
"""
    return Response(robots_txt, mimetype="text/plain")


# -----------------------------
# Health Check Route
# Useful for testing on cPanel
# -----------------------------
@app.route("/health")
def health():
    return jsonify({
        "success": True,
        "message": "EMIS website is running.",
        "bot_ready": BOT_READY,
        "bot_error": BOT_ERROR,
    }), 200


# -----------------------------
# Chatbot API
# -----------------------------
@app.route("/api/chat", methods=["POST"])
def api_chat():
    if not BOT_READY or emis_bot is None:
        return jsonify({
            "success": False,
            "reply": contact_fallback_message(),
            "error": BOT_ERROR,
        }), 200

    try:
        data = request.get_json(silent=True) or {}

        message = (data.get("message") or "").strip()
        history = data.get("history") or []

        if not message:
            return jsonify({
                "success": False,
                "reply": "Please type a message first 😊",
            }), 400

        if not isinstance(history, list):
            history = []

        reply = emis_bot.answer(message, chat_history=history)

        return jsonify({
            "success": True,
            "reply": reply,
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "reply": (
                "Sorry, something went wrong while processing your request 😊\n\n"
                "Please contact EMIS directly:\n"
                "📞 EDA: 0817 202 2401\n"
                "📞 EDO: 0805 446 4613\n"
                "📞 DOS: 0803 448 6651\n"
                "📞 School Accountant: 0806 227 7046\n"
                f"📧 {EMIS_EMAIL}"
            ),
            "error": str(e),
        }), 200


# -----------------------------
# Error Handlers
# -----------------------------
@app.errorhandler(404)
def not_found(error):
    return render_template(
        "404.html",
        page_title="Page Not Found",
        current_page="404",
        contacts=EMIS_CONTACTS,
        email=EMIS_EMAIL,
    ), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error.",
        "reply": contact_fallback_message(),
    }), 500


# -----------------------------
# cPanel / Passenger Entry Point
# -----------------------------
application = app


# -----------------------------
# Local Development Entry Point
# -----------------------------
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
    )