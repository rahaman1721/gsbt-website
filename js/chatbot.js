document.addEventListener("DOMContentLoaded", function () {
    // Inject Chatbot HTML if not already injected
    if (!document.getElementById('gsbt-chatbot')) {
        const prefix = window.GSBT_ROOT_PREFIX || '';
        const logoPath = prefix + 'images/gojan-logo.png';

        const chatbotHTML = `
            <div id="gsbt-chatbot" class="gsbt-chatbot-container">
                <div id="gsbt-chat-window" class="gsbt-chatbot-window">
                    <div class="gsbt-chatbot-header">
                        <img src="${logoPath}" alt="GSBT Logo" onerror="this.src='https://ui-avatars.com/api/?name=GSBT&background=fff&color=1a7a2e'">
                        <div class="gsbt-chatbot-header-info">
                            <h4>GSBT Assistant <span class="status-dot"></span></h4>
                            <span style="font-size: 12px; opacity: 0.9; margin-top: 2px;">Typically replies instantly</span>
                        </div>
                    </div>
                    <div id="gsbt-chat-messages" class="gsbt-chatbot-messages">
                        <div class="gsbt-chat-message bot">
                            Hello! 👋 Welcome to Gojan School of Business and Technology. I am the GSBT assistant. How can I help you today?
                        </div>
                    </div>
                    <div class="gsbt-chatbot-input">
                        <input type="text" id="gsbt-chat-input" placeholder="Type your message..." autocomplete="off">
                        <button id="gsbt-chat-send" aria-label="Send Message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
                <button id="gsbt-chat-toggle" class="gsbt-chatbot-toggle" aria-label="Toggle Chat">
                    <img src="${logoPath}" alt="Chat" id="gsbt-toggle-img" onerror="this.src='https://ui-avatars.com/api/?name=G&background=fff&color=1a7a2e'">
                    <svg id="gsbt-close-icon" class="close-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    const prefix = window.GSBT_ROOT_PREFIX || '';
    const API_URL = prefix + 'chatbot_api.php';

    // ── Generate or load persistent session ID ───────────────────────────────
    let sessionId = sessionStorage.getItem('gsbt_session_id');
    if (!sessionId) {
        sessionId = 'gsbt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('gsbt_session_id', sessionId);
    }
    let lastAdminMsgId = 0;
    let adminPollTimer = null;

    const toggleBtn = document.getElementById('gsbt-chat-toggle');
    const chatWindow = document.getElementById('gsbt-chat-window');
    const toggleImg = document.getElementById('gsbt-toggle-img');
    const closeIcon = document.getElementById('gsbt-close-icon');
    const sendBtn = document.getElementById('gsbt-chat-send');
    const chatInput = document.getElementById('gsbt-chat-input');
    const messagesContainer = document.getElementById('gsbt-chat-messages');

    let isChatOpen = false;

    // ── Save a message to backend ────────────────────────────────────────────
    function saveMessage(sender, message, isHtml) {
        fetch(API_URL + '?action=save_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                sender: sender,
                message: message,
                is_html: isHtml || false,
                page_url: window.location.href
            })
        }).catch(() => { }); // Fail silently on network issues
    }

    // ── Poll for admin replies ───────────────────────────────────────────────
    function startAdminPoll() {
        if (adminPollTimer) return;
        adminPollTimer = setInterval(async () => {
            try {
                const res = await fetch(`${API_URL}?action=poll&session_id=${sessionId}&last_id=${lastAdminMsgId}`);
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    data.messages.forEach(m => {
                        addMessage('🎓 Admin: ' + m.message, 'bot', false);
                        lastAdminMsgId = m.id;
                    });
                }
            } catch (e) { }
        }, 4000);
    }

    // ── UI helpers ───────────────────────────────────────────────────────────
    const addMessage = (text, sender, isHtml = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `gsbt-chat-message ${sender}`;
        if (isHtml && sender === 'bot') {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    };

    const addTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'gsbt-chat-message bot gsbt-typing-indicator';
        typingDiv.innerHTML = '<div class="gsbt-typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    };

    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // ── Toggle Chat Window ───────────────────────────────────────────────────
    toggleBtn.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.add('active');
            toggleImg.style.opacity = '0';
            setTimeout(() => {
                toggleImg.style.display = 'none';
                closeIcon.style.display = 'block';
            }, 150);
            setTimeout(() => chatInput.focus(), 300);
            startAdminPoll();
        } else {
            chatWindow.classList.remove('active');
            closeIcon.style.display = 'none';
            toggleImg.style.display = 'block';
            setTimeout(() => toggleImg.style.opacity = '1', 10);
        }
    });

    // ── Handle Message Send ──────────────────────────────────────────────────
    const handleSend = () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';

            // Save user message to DB
            saveMessage('user', message, false);

            const typing = addTypingIndicator();

            setTimeout(() => {
                typing.remove();

                let reply = "Thank you for reaching out! Our team will get back to you soon. Please contact 044-26311001 or gsbt@gsbt.edu.in for immediate assistance.";
                const lowerMsg = message.toLowerCase();
                let isHtml = true;

                if (lowerMsg.match(/(admission|apply|join|enroll)/)) {
                    reply = `For admissions, you can visit our <a href="${prefix}Admission/apply_online.html" style="color:#1a7a2e;text-decoration:underline;">Apply Online</a> page, check <a href="${prefix}Admission/admission_eligibility.html" style="color:#1a7a2e;text-decoration:underline;">Eligibility</a>, or see the <a href="${prefix}Admission/admission_procedure.html" style="color:#1a7a2e;text-decoration:underline;">Procedure</a>. You can also contact our admission cell at 044-26311001.`;
                } else if (lowerMsg.match(/(course|department|program|branch)/)) {
                    reply = `We offer various UG and PG programs including CSE, AI&ML, Cyber Security, ECE, Mechanical, Aero, Pharma, and more. Check our <a href="${prefix}Depatment/dept-cse.html" style="color:#1a7a2e;text-decoration:underline;">Departments section</a> for full details.`;
                } else if (lowerMsg.match(/(placement|job|recruit|career)/)) {
                    reply = `GSBT has excellent placement records with regular recruiters from top MNCs like CTS, TCS, Wipro, and Infosys. Visit our <a href="${prefix}Corporate/corporate_connect.html" style="color:#1a7a2e;text-decoration:underline;">Placements section</a> or see <a href="${prefix}Corporate/hiring_highlights.html" style="color:#1a7a2e;text-decoration:underline;">Hiring Highlights</a> to learn more.`;
                } else if (lowerMsg.match(/(fee|cost|scholarship)/)) {
                    reply = `For detailed fee structures and scholarship opportunities, please check our <a href="${prefix}Admission/scholarship.html" style="color:#1a7a2e;text-decoration:underline;">Scholarships</a> page, explore <a href="${prefix}Admission/education_loan.html" style="color:#1a7a2e;text-decoration:underline;">Education Loans</a>, or contact our administrative office.`;
                } else if (lowerMsg.match(/(academic|calendar|syllabus|regulation|exam)/)) {
                    reply = `You can view our <a href="${prefix}Academic/regulations.html" style="color:#1a7a2e;text-decoration:underline;">Regulations</a>, <a href="${prefix}Academic/curriculum_syllabus.html" style="color:#1a7a2e;text-decoration:underline;">Curriculum & Syllabus</a>, and <a href="${prefix}Academic/academic_schedule.html" style="color:#1a7a2e;text-decoration:underline;">Academic Schedule</a> in the Academics section.`;
                } else if (lowerMsg.match(/(about|vision|mission|management|director|principal)/)) {
                    reply = `Learn more about our <a href="${prefix}About/vision_mission.html" style="color:#1a7a2e;text-decoration:underline;">Vision & Mission</a>, <a href="${prefix}About/principal.html" style="color:#1a7a2e;text-decoration:underline;">Principal</a>, and the management behind GSBT in our <a href="${prefix}About/life_at_gojan.html" style="color:#1a7a2e;text-decoration:underline;">About Us section</a>.`;
                } else if (lowerMsg.match(/(campus|facility|hostel|sport|club|library)/)) {
                    reply = `We provide excellent facilities including <a href="${prefix}Campus-Life/learning-facilities.html" style="color:#1a7a2e;text-decoration:underline;">Libraries</a>, <a href="${prefix}Campus-Life/sports-facilities.html" style="color:#1a7a2e;text-decoration:underline;">Sports</a>, and <a href="${prefix}Campus-Life/student-club.html" style="color:#1a7a2e;text-decoration:underline;">Student Clubs</a>. Discover more in our Campus Life section.`;
                } else if (lowerMsg.match(/(research|r&d|innovation|coe|startup|patent)/)) {
                    reply = `GSBT fosters innovation through its <a href="${prefix}R&D/research_development.html" style="color:#1a7a2e;text-decoration:underline;">R&D Cell</a>, <a href="${prefix}R&D/coe.html" style="color:#1a7a2e;text-decoration:underline;">Centre of Excellence</a>, and <a href="${prefix}R&D/startups_incubation.html" style="color:#1a7a2e;text-decoration:underline;">Startup Incubation</a>.`;
                } else if (lowerMsg.match(/(accreditation|naac|nba|nirf|aicte|ugc)/)) {
                    reply = `GSBT is recognized by <a href="${prefix}aicte.html" style="color:#1a7a2e;text-decoration:underline;">AICTE</a>, affiliated to Anna University, and accredited by <a href="${prefix}Utility/naac.html" style="color:#1a7a2e;text-decoration:underline;">NAAC</a>. View our <a href="${prefix}Utility/IQAC/AQAR/aqar.html" style="color:#1a7a2e;text-decoration:underline;">AQAR</a> and <a href="${prefix}Utility/nirf.html" style="color:#1a7a2e;text-decoration:underline;">NIRF</a> details online.`;
                } else if (lowerMsg.match(/(hi|hello|hey|greetings)/)) {
                    reply = "Hello there! 👋 How can I assist you with information about GSBT today? Try asking me about Admissions, Courses, Placements, or Facilities.";
                    isHtml = false;
                } else {
                    isHtml = false;
                }

                addMessage(reply, 'bot', isHtml);
                // Save bot reply to DB
                saveMessage('bot', reply, isHtml);

            }, 1000 + Math.random() * 800);
        }
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Auto-open poll when page loads in case user left and came back
    startAdminPoll();
});
