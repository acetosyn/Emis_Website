# EMIS Website

Official website project for **Epitome Model Islamic School (EMIS)**.

## About EMIS
EMIS is a private Islamic school offering a rich blend of **Islamic and Western Education**.

The school includes:

- Creche
- Nursery
- Primary
- Junior Secondary School
- Senior Secondary School

EMIS also runs:

- **Tahfeezul-Qur’an** from age 3
- An **Islamiyyah Program** that is unrivaled

## Contact
**Phone:** 0817 202 2402

## Tech Stack
- Python 3.14
- Flask
- HTML5
- CSS3
- Bootstrap
- JavaScript

## Project Structure
```bash
.
│   app.py
│   README.md
│   README.txt
│   requirements.txt
│
├───static
│   ├───css
│   ├───images
│   ├───js
│   └───lib
│
└───templates
    │   index.html
    │   about.html
    │   contact.html
    │   courses.html
    │   team.html
    │   testimonial.html
    │   404.html



    Running the Project
1. Create a virtual environment
python -m venv venv
2. Activate the virtual environment

Windows

venv\Scripts\activate

Mac/Linux

source venv/bin/activate
3. Install dependencies
pip install -r requirements.txt
4. Run the app
python app.py
5. Open in browser
http://127.0.0.1:5000
Notes

This project was originally adapted from the eLEARNING HTML Template by HTML Codex and is being customized into the official EMIS school website with updated branding, content, and structure.


---

### `requirements.txt`
For your current app, this is enough:

```txt
Flask>=3.1.0
Werkzeug>=3.1.0
Jinja2>=3.1.0
itsdangerous>=2.2.0
click>=8.1.0
blinker>=1.9.0
MarkupSafe>=3.0.0

But the cleaner and more standard version is simply:

Flask>=3.1.0
