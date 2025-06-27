
        let messages = [
            {
                id: 1,
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah.johnson@email.com',
                phone: '+1 (555) 123-4567',
                subject: 'Web Development Project',
                message: 'Hi Henry, I\'m interested in hiring you for a complete website redesign. We\'re a small business looking to modernize our online presence. Could we schedule a call to discuss the project requirements and timeline?',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                read: false
            },
            {
                id: 2,
                firstName: 'Michael',
                lastName: 'Chen',
                email: 'michael.chen@company.com',
                phone: '+1 (555) 987-6543',
                subject: 'UI/UX Design Consultation',
                message: 'Hello! I came across your portfolio and I\'m really impressed with your work. We have an existing app that needs a UI refresh. Would you be available for a consultation to discuss our needs?',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                read: true
            },
            {
                id: 3,
                firstName: 'Emma',
                lastName: 'Davis',
                email: 'emma.davis@startup.io',
                phone: '',
                subject: 'Collaboration Opportunity',
                message: 'Hey Henry, I\'m the founder of a tech startup and we\'re looking for a talented frontend developer to join our team as a contractor. Your work is exactly what we\'re looking for. Let\'s chat!',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                read: false
            },
            {
                id: 4,
                firstName: 'James',
                lastName: 'Wilson',
                email: 'james.wilson@agency.com',
                phone: '+1 (555) 456-7890',
                subject: 'Partnership Proposal',
                message: 'Hi there! I run a digital marketing agency and we often need quality frontend development work. Would you be interested in a partnership where we refer clients to each other?',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                read: true
            }
        ];

        // DOM elements
        const messagesList = document.getElementById('messagesList');
        const searchBox = document.getElementById('searchBox');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const messageModal = document.getElementById('messageModal');
        const closeBtn = document.querySelector('.close-btn');
        const markAsReadBtn = document.getElementById('markAsRead');
        const replyBtn = document.getElementById('replyBtn');

        let currentFilter = 'all';
        let currentMessage = null;

        // Initialize dashboard
        function initDashboard() {
            updateStats();
            renderMessages();
            setupEventListeners();
        }

        // Update dashboard statistics
        function updateStats() {
            const totalMessages = messages.length;
            const unreadMessages = messages.filter(msg => !msg.read).length;
            const todayMessages = messages.filter(msg => {
                const today = new Date();
                const msgDate = new Date(msg.timestamp);
                return msgDate.toDateString() === today.toDateString();
            }).length;

            document.getElementById('totalMessages').textContent = totalMessages;
            document.getElementById('unreadMessages').textContent = unreadMessages;
            document.getElementById('todayMessages').textContent = todayMessages;
        }

        // Render messages list
        function renderMessages() {
            let filteredMessages = messages;

            // Apply filter
            if (currentFilter === 'unread') {
                filteredMessages = messages.filter(msg => !msg.read);
            } else if (currentFilter === 'read') {
                filteredMessages = messages.filter(msg => msg.read);
            }

            // Apply search
            const searchTerm = searchBox.value.toLowerCase();
            if (searchTerm) {
                filteredMessages = filteredMessages.filter(msg => 
                    msg.firstName.toLowerCase().includes(searchTerm) ||
                    msg.lastName.toLowerCase().includes(searchTerm) ||
                    msg.email.toLowerCase().includes(searchTerm) ||
                    msg.subject.toLowerCase().includes(searchTerm) ||
                    msg.message.toLowerCase().includes(searchTerm)
                );
            }

            // Sort by timestamp (newest first)
            filteredMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Render messages
            if (filteredMessages.length === 0) {
                messagesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class='bx bx-envelope'></i>
                        </div>
                        <p>No messages found</p>
                    </div>
                `;
                return;
            }

            messagesList.innerHTML = filteredMessages.map(msg => `
                <div class="message-card ${!msg.read ? 'unread' : ''}" data-id="${msg.id}">
                    <div class="message-header">
                        <div class="message-info">
                            <div class="sender-name">${msg.firstName} ${msg.lastName}</div>
                            <div class="message-meta">
                                <span><i class='bx bx-envelope'></i> ${msg.email}</span>
                                ${msg.phone ? `<span><i class='bx bx-phone'></i> ${msg.phone}</span>` : ''}
                                <span><i class='bx bx-time'></i> ${formatTimestamp(msg.timestamp)}</span>
                            </div>
                            <div class="subject">${msg.subject}</div>
                            <div class="message-preview">${msg.message}</div>
                        </div>
                        <div class="message-actions">
                            <span class="status-badge ${msg.read ? 'status-read' : 'status-unread'}">
                                ${msg.read ? 'Read' : 'Unread'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click event listeners to message cards
            document.querySelectorAll('.message-card').forEach(card => {
                card.addEventListener('click', () => {
                    const messageId = parseInt(card.dataset.id);
                    openMessageModal(messageId);
                });
            });
        }

        // Format timestamp
        function formatTimestamp(timestamp) {
            const now = new Date();
            const msgDate = new Date(timestamp);
            const diffInMinutes = Math.floor((now - msgDate) / (1000 * 60));

            if (diffInMinutes < 60) {
                return `${diffInMinutes} minutes ago`;
            } else if (diffInMinutes < 1440) {
                const hours = Math.floor(diffInMinutes / 60);
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diffInMinutes / 1440);
                return `${days} day${days > 1 ? 's' : ''} ago`;
            }
        }

        // Open message modal
        function openMessageModal(messageId) {
            currentMessage = messages.find(msg => msg.id === messageId);
            if (!currentMessage) return;

            // Mark as read
            if (!currentMessage.read) {
                currentMessage.read = true;
                updateStats();
                renderMessages();
            }

            // Populate modal content
            document.getElementById('messageDetails').innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">From:</span>
                    <span class="detail-value">${currentMessage.firstName} ${currentMessage.lastName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${currentMessage.email}</span>
                </div>
                ${currentMessage.phone ? `
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${currentMessage.phone}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Subject:</span>
                    <span class="detail-value">${currentMessage.subject}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${currentMessage.timestamp.toLocaleString()}</span>
                </div>
            `;

            document.getElementById('messageContent').textContent = currentMessage.message;

            // Update modal buttons
            markAsReadBtn.style.display = currentMessage.read ? 'none' : 'inline-block';

            // Show modal
            messageModal.style.display = 'block';
        }

        // Setup event listeners
        function setupEventListeners() {
            // Filter buttons
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.dataset.filter;
                    renderMessages();
                });
            });

            // Search box
            searchBox.addEventListener('input', renderMessages);

            // Modal close
            closeBtn.addEventListener('click', () => {
                messageModal.style.display = 'none';
            });

            // Click outside modal to close
            messageModal.addEventListener('click', (e) => {
                if (e.target === messageModal) {
                    messageModal.style.display = 'none';
                }
            });

            // Mark as read button
            markAsReadBtn.addEventListener('click', () => {
                if (currentMessage) {
                    currentMessage.read = true;
                    updateStats();
                    renderMessages();
                    markAsReadBtn.style.display = 'none';
                }
            });

            // Reply button
            replyBtn.addEventListener('click', () => {
                if (currentMessage) {
                    window.location.href = `mailto:${currentMessage.email}?subject=Re: ${currentMessage.subject}`;
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && messageModal.style.display === 'block') {
                    messageModal.style.display = 'none';
                }
            });
        }

        // Function to add new message (called from contact form)
        function addMessage(messageData) {
            const newMessage = {
                id: messages.length + 1,
                firstName: messageData.firstName,
                lastName: messageData.lastName,
                email: messageData.email,
                phone: messageData.phone || '',
                subject: messageData.subject,
                message: messageData.message,
                timestamp: new Date(),
                read: false
            };

            messages.unshift(newMessage);
            updateStats();
            renderMessages();
        }

        // Make addMessage available globally for the contact form
        window.addMessage = addMessage;

        // Initialize dashboard when page loads
        document.addEventListener('DOMContentLoaded', initDashboard);

        // Auto-refresh every 30 seconds (to check for new messages)
        setInterval(() => {
            updateStats();
            renderMessages();
        }, 30000);