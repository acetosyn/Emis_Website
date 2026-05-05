"""
contact_server.py — EMIS Contact Form Email Handler
Epitome Model Islamic Schools

Handles website contact form submissions and sends enquiry emails
to the school official mailbox.
"""

import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ======================================================
# EMAIL CONFIG
# ======================================================

POSTMARK_SERVER_TOKEN = os.getenv("POSTMARK_SERVER_TOKEN", "").strip()
POSTMARK_MESSAGE_STREAM = os.getenv("POSTMARK_MESSAGE_STREAM", "outbound").strip()

EMAIL_FROM = os.getenv(
    "EMAIL_FROM",
    "Epitome Model Islamic Schools <noreply@epitomeschools.com>"
).strip()

CONTACT_NOTIFY_EMAIL = os.getenv(
    "CONTACT_NOTIFY_EMAIL",
    "epitomeschools17@gmail.com"
).strip()

POSTMARK_URL = "https://api.postmarkapp.com/email"

print(
    "[emis-contact] token_set =",
    bool(POSTMARK_SERVER_TOKEN),
    "| stream =",
    POSTMARK_MESSAGE_STREAM,
    "| from =",
    EMAIL_FROM,
    "| notify =",
    CONTACT_NOTIFY_EMAIL
)


# ======================================================
# HELPERS
# ======================================================

def _clean(value):
    """Clean form values safely."""
    return str(value or "").strip()


def _postmark_send(to_email: str, subject: str, text_body: str, html_body: str) -> bool:
    """Send email using Postmark HTTPS API."""
    token = (POSTMARK_SERVER_TOKEN or "").strip()

    if not token:
        print("[emis-contact] ❌ Missing POSTMARK_SERVER_TOKEN")
        return False

    if not to_email:
        print("[emis-contact] ❌ Missing recipient email")
        return False

    payload = {
        "From": EMAIL_FROM,
        "To": to_email,
        "Subject": subject,
        "TextBody": text_body or " ",
        "HtmlBody": html_body or "<p> </p>",
        "MessageStream": POSTMARK_MESSAGE_STREAM,
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": token,
    }

    try:
        response = requests.post(
            POSTMARK_URL,
            headers=headers,
            json=payload,
            timeout=25
        )

        if 200 <= response.status_code < 300:
            print(f"[emis-contact] ✅ Email sent to {to_email}")
            return True

        try:
            error_message = response.json()
        except Exception:
            error_message = response.text

        print(f"[emis-contact] ❌ Email failed: {response.status_code}")
        print(f"[emis-contact] ❌ Error: {error_message}")
        return False

    except Exception as e:
        print(f"[emis-contact] ❌ Request error: {e}")
        return False


# ======================================================
# MAIN CONTACT EMAIL FUNCTION
# ======================================================

def send_contact_email(data: dict) -> dict:
    """
    Sends contact form enquiry to EMIS official email.

    Expected fields:
    - name
    - phone
    - email
    - interest
    - message
    """

    name = _clean(data.get("name"))
    phone = _clean(data.get("phone"))
    email = _clean(data.get("email"))
    interest = _clean(data.get("interest"))
    message = _clean(data.get("message"))
    submitted_at = datetime.now().strftime("%A, %d %B %Y - %I:%M %p")

    subject = f"[EMIS Website] New Contact Enquiry — {name or 'Website Visitor'}"

    text_body = f"""
Dear EMIS Team,

A new enquiry has been submitted through the EMIS website contact form.

Name: {name or 'N/A'}
Phone: {phone or 'N/A'}
Email: {email or 'N/A'}
Enquiry Type: {interest or 'N/A'}
Submitted At: {submitted_at}

Message:
{message or 'N/A'}

Please respond to the parent/guardian as soon as possible.

Warm regards,
EMIS Website Contact System
"""

    html_body = f"""
    <div style="font-family:Segoe UI, Arial, sans-serif; color:#111827; line-height:1.7; background:#f8fafc; padding:24px;">
        <div style="max-width:680px; margin:auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">
            
            <div style="background:linear-gradient(135deg,#16833d,#22c55e); padding:22px 24px; color:#ffffff;">
                <h2 style="margin:0; font-size:22px;">New EMIS Contact Enquiry</h2>
                <p style="margin:6px 0 0; opacity:.92;">Submitted from the school website contact form</p>
            </div>

            <div style="padding:24px;">
                <p>Dear <b>EMIS Team</b>,</p>
                <p>A new enquiry has been submitted through the EMIS website.</p>

                <table style="width:100%; border-collapse:collapse; margin-top:14px;">
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7; font-weight:700; width:160px;">Name</td>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7;">{name or 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7; font-weight:700;">Phone</td>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7;">{phone or 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7; font-weight:700;">Email</td>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7;">{email or 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7; font-weight:700;">Enquiry Type</td>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7;">{interest or 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7; font-weight:700;">Submitted At</td>
                        <td style="padding:10px; border-bottom:1px solid #eef2f7;">{submitted_at}</td>
                    </tr>
                </table>

                <div style="margin-top:20px;">
                    <h3 style="margin:0 0 8px; color:#182338;">Message</h3>
                    <div style="background:#f8fcf9; border:1px solid #e5e7eb; border-radius:14px; padding:16px;">
                        {message or 'N/A'}
                    </div>
                </div>

                <p style="margin-top:22px;">Please respond to the parent/guardian as soon as possible.</p>

                <p style="margin-top:24px; color:#6b7280;">
                    Warm regards,<br>
                    <b>EMIS Website Contact System</b>
                </p>
            </div>
        </div>
    </div>
    """.strip()

    admin_ok = _postmark_send(
        CONTACT_NOTIFY_EMAIL,
        subject,
        text_body,
        html_body
    )

    return {
        "admin": admin_ok,
        "recipient": CONTACT_NOTIFY_EMAIL
    }