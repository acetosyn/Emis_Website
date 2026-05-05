import os
import re
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from groq import Groq

try:
    from duckduckgo_search import DDGS
    DDG_AVAILABLE = True
except Exception:
    DDGS = None
    DDG_AVAILABLE = False


load_dotenv()


class EMISChatBot:
    """
    Friendly EMIS school chatbot powered by Groq.
    - Answers school questions from internal EMIS knowledge first
    - Falls back to DuckDuckGo search for outside questions
    - Returns school contact details when no reliable answer is found
    """

    def __init__(self) -> None:
        self.api_key = (
            os.getenv("Groq_api")
            or os.getenv("GROQ_API_KEY")
            or os.getenv("groq_api")
        )

        if not self.api_key:
            raise ValueError(
                "Groq API key not found. Add 'Groq_api' or 'GROQ_API_KEY' to your .env file."
            )

        self.client = Groq(api_key=self.api_key)

        # Use a dependable Groq production model
        self.model = "llama-3.3-70b-versatile"

        self.contact_info = {
            "contacts": [
                {
                    "role": "EDA",
                    "title": "Executive Director Administration",
                    "phone": "08172022401",
                },
                {
                    "role": "EDO",
                    "title": "Executive Director Operations",
                    "phone": "08054464613",
                },
                {
                    "role": "DOS",
                    "title": "Director of Studies",
                    "phone": "08034486651",
                },
                {
                    "role": "School Accountant",
                    "title": "Accounts and school fees enquiries",
                    "phone": "08062277046",
                },
            ],
            "email": "epitomeschools17@gmail.com",
        }

        self.school_knowledge = self._build_school_knowledge()

    def _build_school_knowledge(self) -> Dict[str, str]:
        """
        Internal EMIS knowledge assembled from your provided pages.
        This gives the bot grounded information before using web search.
        """
        return {
            "about": (
                "Epitome Model Islamic Schools (EMIS) is a group of co-educational institutions established in 2008. "
                "The school is committed to raising students with knowledge, discipline, moral excellence, and the fear of Allah. "
                "EMIS provides a balanced blend of Western and Islamic education and focuses on academic excellence, character development, "
                "leadership, and purposeful learning."
            ),
            "vision_mission": (
                "EMIS aims to prepare young minds for a better future through faith and education. "
                "Its vision is centered on raising a generation where the fear of Allah guides leaders and where mutual suspicion and division fade away. "
                "Its mission is to reduce illiteracy through total education in Western and Islamic studies, sciences, languages, arts, and crafts."
            ),
            "values": (
                "EMIS values include care, acceptance, responsibility, and excellence. "
                "The school community encourages kindness, respect, tolerance, professionalism, support, and doing one's best."
            ),
            "programs": (
                "EMIS offers Creche, Nursery, Primary School, Junior Secondary, Senior Secondary, Tahfeezul-Qur'an Programme, and Islamiyyah Programme. "
                "The school combines the Nigerian curriculum, Islamic curriculum, and Montessori methods for a strong and balanced educational foundation."
            ),
            "tahfeez": (
                "The Tahfeezul-Qur'an Programme is a specialized Qur'anic memorization programme. "
                "It begins from age 3 and helps children build a strong relationship with the Qur'an from an early age."
            ),
            "islamiyyah": (
                "The Islamiyyah Programme supports deep Islamic learning, sound morals, discipline, and responsible character development."
            ),
            "features": (
                "EMIS supports both online and in-person learning. "
                "The school also offers transport services, boarding facilities, and serves families through multiple campuses including Lugbe, Mararaba, Abuja, and Nasarawa State locations."
            ),
            "activities": (
                "EMIS extracurricular activities include football, basketball, badminton, table tennis, skating, chess, polo, golf, French Club, Arabic Club, board games, and self-defense."
            ),
            "hours": (
                "School hours are Monday to Friday, 8:00am to 2:00pm. "
                "Saturday and Sunday are closed."
            ),
            "location": (
                "Epitome Model Islamic Schools is located in Mararaba, Nigeria. "
                "One page also describes the school as Off Angwar Hasimu Road, Maraba, Nigeria."
            ),
            "staff": (
                "EMIS staff are described as professional, supportive, disciplined, and experienced. "
                "Teachers are committed to serving students and parents, and the school promotes a positive collaborative atmosphere."
            ),
            "admission": (
                "Parents and guardians can contact EMIS for admission enquiries, class registration information, school programmes, Tahfeez, Islamiyyah, and general school support."
            ),
            "security": (
                "EMIS highlights security measures such as CCTV cameras and security patrol."
            ),
            "highlights": (
                "Additional EMIS highlights include scholarships for outstanding students, school awards, supportive facilities, and a structured learning environment."
            ),
            "contact": (
                "For enquiries, contact EMIS through the appropriate school contact: "
                "EDA, Executive Director of Administration: 08172022401. "
                "EDO, Executive Director of Operations: 08054464613. "
                "DOS, Director of Studies: 08034486651. "
                "School Accountant, for accounts and school fees enquiries: 08062277046. "
                "Email: epitomeschools17@gmail.com."
            ),
        }

    def _normalize(self, text: str) -> str:
        return re.sub(r"\s+", " ", text.strip().lower())

    def _keyword_score(self, question: str) -> List[Tuple[str, int]]:
        """
        Very light intent matching so the bot can prioritize internal school answers.
        """
        q = self._normalize(question)

        keyword_map = {
            "about": ["about", "who are you", "school", "emis", "history", "founded", "founded when"],
            "vision_mission": ["vision", "mission", "purpose", "goal", "aim"],
            "values": ["value", "values", "character", "discipline", "moral"],
            "programs": ["program", "programs", "courses", "classes", "levels", "creche", "nursery", "primary", "secondary"],
            "tahfeez": ["tahfeez", "quran", "memorization", "memorisation"],
            "islamiyyah": ["islamiyyah", "islamic studies", "deen", "islamic"],
            "features": ["boarding", "transport", "online", "in-person", "campus", "campuses"],
            "activities": ["sport", "sports", "activities", "club", "clubs", "chess", "football", "basketball", "self-defense"],
            "hours": ["time", "hours", "open", "opening", "closing", "close", "school hours"],
            "location": ["where", "location", "address", "map", "mararaba", "maraba", "lugbe", "abuja", "nasarawa"],
            "staff": ["teacher", "teachers", "staff", "educators", "management", "director", "dos", "eda", "edo", "accountant"],
            "admission": ["admission", "register", "registration", "enroll", "enrol", "apply", "class registration"],
            "security": ["security", "cctv", "safe", "patrol"],
            "highlights": ["scholarship", "award", "awards", "highlight", "benefit"],
            "contact": [
                "contact",
                "phone",
                "number",
                "email",
                "whatsapp",
                "call",
                "eda",
                "edo",
                "dos",
                "director of studies",
                "accountant",
                "school fees",
                "accounts",
            ],
        }

        scores = []

        for topic, keywords in keyword_map.items():
            score = sum(1 for word in keywords if word in q)
            if score > 0:
                scores.append((topic, score))

        return sorted(scores, key=lambda item: item[1], reverse=True)

    def _get_school_context(self, question: str) -> str:
        """
        Select relevant school knowledge snippets for the question.
        """
        scores = self._keyword_score(question)

        if not scores:
            # Still provide broad EMIS context for general questions
            base_topics = ["about", "programs", "admission", "contact"]
            return "\n\n".join(
                f"{topic.upper()}: {self.school_knowledge[topic]}" for topic in base_topics
            )

        selected_topics = [topic for topic, _ in scores[:4]]

        # Always keep contact available
        if "contact" not in selected_topics:
            selected_topics.append("contact")

        return "\n\n".join(
            f"{topic.upper()}: {self.school_knowledge[topic]}"
            for topic in selected_topics
        )

    def _needs_web_search(self, question: str) -> bool:
        """
        Decide when to search outside EMIS scope.
        """
        q = self._normalize(question)

        outside_scope_patterns = [
            "latest",
            "news",
            "today",
            "yesterday",
            "weather",
            "jamb",
            "waec",
            "neco",
            "government",
            "university ranking",
            "visa",
            "job",
            "scholarship abroad",
            "compare schools",
            "best school in",
            "current affair",
            "current affairs",
            "outside emis",
            "not about emis",
        ]

        school_terms = [
            "emis", "epitome", "school", "admission", "class", "program",
            "courses", "creche", "nursery", "primary", "secondary",
            "tahfeez", "islamiyyah", "staff", "contact", "location",
            "hours", "boarding", "transport", "eda", "edo", "dos",
            "accountant", "school fees"
        ]

        has_school_term = any(term in q for term in school_terms)
        has_outside_term = any(term in q for term in outside_scope_patterns)

        # Search externally if question clearly goes beyond school knowledge
        if has_outside_term and not has_school_term:
            return True

        # If nothing matches internal intent strongly, allow search
        return len(self._keyword_score(question)) == 0

    def _search_web(self, query: str, max_results: int = 5) -> List[Dict[str, str]]:
        """
        DuckDuckGo fallback search.
        Requires: pip install duckduckgo-search
        """
        if not DDG_AVAILABLE:
            return []

        try:
            with DDGS() as ddgs:
                results = ddgs.text(
                    query,
                    max_results=max_results
                )

            cleaned = []
            for item in results or []:
                cleaned.append({
                    "title": item.get("title", ""),
                    "href": item.get("href", ""),
                    "body": item.get("body", ""),
                })
            return cleaned
        except Exception:
            return []

    def _format_search_context(self, search_results: List[Dict[str, str]]) -> str:
        if not search_results:
            return ""

        lines = []
        for idx, item in enumerate(search_results[:5], start=1):
            lines.append(
                f"{idx}. Title: {item.get('title', '')}\n"
                f"   Snippet: {item.get('body', '')}\n"
                f"   Link: {item.get('href', '')}"
            )
        return "\n\n".join(lines)

    def _formatted_contacts_text(self) -> str:
        return (
            "📞 EDA: 0817 202 2401\n"
            "📞 EDO: 0805 446 4613\n"
            "📞 DOS: 0803 448 6651\n"
            "📞 School Accountant: 0806 227 7046\n"
            f"📧 {self.contact_info['email']}"
        )

    def _contact_fallback_text(self) -> str:
        return (
            "I couldn’t find a reliable answer for that right now 😊\n\n"
            "Please contact EMIS directly for help:\n"
            f"{self._formatted_contacts_text()}\n\n"
            "They’ll be able to guide you properly 🤝"
        )

    def answer(self, question: str, chat_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Main chat method.
        chat_history format:
        [
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."}
        ]
        """
        question = (question or "").strip()

        if not question:
            return (
                "Hi there 👋😊\n"
                "I’m the EMIS assistant. Ask me about admissions, programs, classes, Tahfeez, Islamiyyah, school hours, or contact details."
            )

        school_context = self._get_school_context(question)
        web_context = ""

        if self._needs_web_search(question):
            search_results = self._search_web(question)
            web_context = self._format_search_context(search_results)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a warm, friendly, helpful assistant for Epitome Model Islamic Schools (EMIS). "
                    "Your tone should be human, welcoming, and parent-friendly. "
                    "Use simple English and occasionally use friendly emojis like 😊📚✨🤝 but do not overdo it. "
                    "Always prioritize EMIS internal school information when answering school-related questions. "
                    "If the question is about admissions, classes, registration, Tahfeez, Islamiyyah, school programs, hours, or contact details, "
                    "answer from the EMIS context provided. "
                    "If a user asks for contact details, phone numbers, WhatsApp numbers, school fees contact, accountant, EDA, EDO, or DOS, "
                    "provide the relevant EMIS contacts clearly. "
                    "If the answer is uncertain or not available in the EMIS context, use the web context if available. "
                    "If both are insufficient, politely say you are not fully sure and provide these contact details exactly:\n"
                    "EDA: 0817 202 2401\n"
                    "EDO: 0805 446 4613\n"
                    "DOS: 0803 448 6651\n"
                    "School Accountant: 0806 227 7046\n"
                    "Email: epitomeschools17@gmail.com\n\n"
                    "Keep answers concise, friendly, and useful. "
                    "Do not invent school fees, deadlines, or admissions rules that were not provided."
                ),
            },
            {
                "role": "system",
                "content": f"EMIS INTERNAL CONTEXT:\n{school_context}",
            }
        ]

        if web_context:
            messages.append(
                {
                    "role": "system",
                    "content": f"WEB SEARCH CONTEXT:\n{web_context}",
                }
            )

        if chat_history:
            # Keep only a few turns for efficiency
            trimmed_history = chat_history[-6:]
            for item in trimmed_history:
                role = item.get("role")
                content = item.get("content", "").strip()
                if role in {"user", "assistant"} and content:
                    messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": question})

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.5,
                max_completion_tokens=500,
            )

            reply = completion.choices[0].message.content.strip()

            # Safety check: if model gives weak/empty answer, use contact fallback
            if not reply or len(reply) < 3:
                return self._contact_fallback_text()

            return reply

        except Exception:
            return self._contact_fallback_text()