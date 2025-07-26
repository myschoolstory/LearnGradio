// Global variables
let currentModule = 1;
let completedModules = new Set();
let editors = {};

// Code examples for different modules
const codeExamples = {
    1: `import gradio as gr

def greet(name, intensity):
    return "Hello, " + name + "!" * int(intensity)

demo = gr.Interface(
    fn=greet,
    inputs=["text", "slider"],
    outputs=["text"],
)

demo.launch()`,
    
    2: `import gradio as gr

def calculator(num1, operation, num2):
    if operation == "add":
        return num1 + num2
    elif operation == "subtract":
        return num1 - num2
    elif operation == "multiply":
        return num1 * num2
    elif operation == "divide":
        return num1 / num2 if num2 != 0 else "Cannot divide by zero"

with gr.Blocks() as demo:
    gr.Markdown("# Simple Calculator")
    
    with gr.Row():
        num1 = gr.Number(label="First Number")
        operation = gr.Dropdown(
            choices=["add", "subtract", "multiply", "divide"],
            label="Operation"
        )
        num2 = gr.Number(label="Second Number")
    
    result = gr.Textbox(label="Result")
    calculate_btn = gr.Button("Calculate")
    
    calculate_btn.click(
        fn=calculator,
        inputs=[num1, operation, num2],
        outputs=result
    )

demo.launch()`,
    
    3: `import gradio as gr

def chatbot_response(message, history):
    # Simple echo chatbot with some personality
    responses = [
        f"That's interesting! You said: '{message}'",
        f"I understand you mentioned: {message}",
        f"Thanks for sharing: {message}",
        f"Tell me more about: {message}",
    ]
    
    import random
    response = random.choice(responses)
    history.append([message, response])
    return "", history

with gr.Blocks() as demo:
    gr.Markdown("# Simple Chatbot")
    
    chatbot = gr.Chatbot()
    msg = gr.Textbox(label="Your message")
    clear = gr.Button("Clear")
    
    msg.submit(chatbot_response, [msg, chatbot], [msg, chatbot])
    clear.click(lambda: None, None, chatbot, queue=False)

demo.launch()`
};

// Component demos
const componentDemos = {
    textbox: {
        title: "Textbox Component",
        description: "Single or multi-line text input",
        code: `gr.Textbox(label="Enter text", placeholder="Type here...")`,
        demo: `<div class="component-live-demo">
            <label>Enter text:</label>
            <input type="text" placeholder="Type here..." class="demo-textbox">
        </div>`
    },
    number: {
        title: "Number Component",
        description: "Numeric input with validation",
        code: `gr.Number(label="Enter number", minimum=0, maximum=100)`,
        demo: `<div class="component-live-demo">
            <label>Enter number:</label>
            <input type="number" min="0" max="100" class="demo-number">
        </div>`
    },
    slider: {
        title: "Slider Component",
        description: "Range selection with min/max values",
        code: `gr.Slider(minimum=0, maximum=100, value=50, label="Select value")`,
        demo: `<div class="component-live-demo">
            <label>Select value: <span id="slider-value">50</span></label>
            <input type="range" min="0" max="100" value="50" class="demo-slider" 
                   oninput="document.getElementById('slider-value').textContent = this.value">
        </div>`
    },
    image: {
        title: "Image Component",
        description: "Image upload and display",
        code: `gr.Image(label="Upload image", type="pil")`,
        demo: `<div class="component-live-demo">
            <label>Upload image:</label>
            <div class="demo-image-upload">
                <div class="upload-placeholder">📷 Click to upload image</div>
            </div>
        </div>`
    },
    audio: {
        title: "Audio Component",
        description: "Audio file upload and recording",
        code: `gr.Audio(label="Upload audio", type="filepath")`,
        demo: `<div class="component-live-demo">
            <label>Upload audio:</label>
            <div class="demo-audio-upload">
                <div class="upload-placeholder">🎵 Click to upload audio</div>
            </div>
        </div>`
    },
    file: {
        title: "File Component",
        description: "File upload of any type",
        code: `gr.File(label="Upload file", file_types=[".pdf", ".txt", ".csv"])`,
        demo: `<div class="component-live-demo">
            <label>Upload file:</label>
            <div class="demo-file-upload">
                <div class="upload-placeholder">📁 Click to upload file</div>
            </div>
        </div>`
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProgress();
    initializeEditors();
});

function initializeApp() {
    // Set up smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize intersection observer for progress tracking
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const moduleId = parseInt(entry.target.id.replace(/\D/g, '')) || 
                                   Array.from(document.querySelectorAll('.module')).indexOf(entry.target) + 1;
                    if (moduleId) {
                        currentModule = moduleId;
                        updateProgress();
                    }
                }
            });
        },
        { threshold: 0.5 }
    );
    
    // Observe all modules
    document.querySelectorAll('.module').forEach(module => {
        observer.observe(module);
    });
}

function initializeEditors() {
    // Initialize Monaco Editor
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        // Initialize editor for first interface module
        if (document.getElementById('editor1')) {
            editors[1] = monaco.editor.create(document.getElementById('editor1'), {
                value: codeExamples[1],
                language: 'python',
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true
            });
        }
        
        // Initialize editor for blocks module
        if (document.getElementById('editor2')) {
            editors[2] = monaco.editor.create(document.getElementById('editor2'), {
                value: codeExamples[2],
                language: 'python',
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true
            });
        }
        
        // Initialize editor for chatbot module
        if (document.getElementById('editor3')) {
            editors[3] = monaco.editor.create(document.getElementById('editor3'), {
                value: codeExamples[3],
                language: 'python',
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                readOnly: true
            });
        }
    });
}

function startLearning() {
    scrollToSection('overview');
    currentModule = 1;
    updateProgress();
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function nextModule(moduleId) {
    const nextSection = document.querySelector(`.module:nth-child(${moduleId + 1})`);
    if (nextSection) {
        nextSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        currentModule = moduleId;
        updateProgress();
    }
}

function completeModule(moduleId) {
    completedModules.add(moduleId);
    saveProgress();
    updateProgress();
    
    // Show completion feedback
    showNotification(`Module ${moduleId} completed! 🎉`);
    
    // Auto-advance to next module
    setTimeout(() => {
        if (moduleId < 8) {
            nextModule(moduleId + 1);
        }
    }, 1000);
}

function updateProgress() {
    const totalModules = 8;
    const progress = (completedModules.size / totalModules) * 100;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }
}

function saveProgress() {
    localStorage.setItem('gradio-learning-progress', JSON.stringify({
        completedModules: Array.from(completedModules),
        currentModule: currentModule
    }));
}

function loadProgress() {
    const saved = localStorage.getItem('gradio-learning-progress');
    if (saved) {
        const data = JSON.parse(saved);
        completedModules = new Set(data.completedModules || []);
        currentModule = data.currentModule || 1;
        updateProgress();
    }
}

function runCode(editorId) {
    const editor = editors[editorId];
    if (!editor) return;
    
    const code = editor.getValue();
    const preview = document.getElementById(`preview${editorId}`);
    
    if (!preview) return;
    
    // Show loading state
    preview.innerHTML = '<div class="preview-loading">Running code...</div>';
    
    // Simulate code execution and show mock interface
    setTimeout(() => {
        let mockInterface = '';
        
        if (editorId === 1) {
            // Simple greeting interface
            mockInterface = `
                <div class="mock-gradio-interface">
                    <h3>Gradio Interface</h3>
                    <div class="mock-inputs">
                        <div class="mock-input-group">
                            <label>name (text)</label>
                            <input type="text" placeholder="Enter text here..." id="mock-name">
                        </div>
                        <div class="mock-input-group">
                            <label>intensity (slider)</label>
                            <input type="range" min="1" max="5" value="1" id="mock-intensity">
                            <span id="intensity-value">1</span>
                        </div>
                    </div>
                    <button onclick="runMockGreeting()" class="mock-submit">Submit</button>
                    <div class="mock-outputs">
                        <label>Output</label>
                        <div class="mock-output" id="mock-output">Click Submit to see output</div>
                    </div>
                </div>
            `;
        } else if (editorId === 2) {
            // Calculator interface
            mockInterface = `
                <div class="mock-gradio-interface">
                    <h3>Simple Calculator</h3>
                    <div class="mock-inputs">
                        <div class="mock-input-group">
                            <label>First Number</label>
                            <input type="number" id="calc-num1" value="10">
                        </div>
                        <div class="mock-input-group">
                            <label>Operation</label>
                            <select id="calc-op">
                                <option value="add">add</option>
                                <option value="subtract">subtract</option>
                                <option value="multiply">multiply</option>
                                <option value="divide">divide</option>
                            </select>
                        </div>
                        <div class="mock-input-group">
                            <label>Second Number</label>
                            <input type="number" id="calc-num2" value="5">
                        </div>
                    </div>
                    <button onclick="runMockCalculator()" class="mock-submit">Calculate</button>
                    <div class="mock-outputs">
                        <label>Result</label>
                        <div class="mock-output" id="calc-output">Click Calculate to see result</div>
                    </div>
                </div>
            `;
        }
        
        preview.innerHTML = mockInterface;
        
        // Add event listeners for interactive elements
        if (editorId === 1) {
            const intensitySlider = document.getElementById('mock-intensity');
            const intensityValue = document.getElementById('intensity-value');
            if (intensitySlider && intensityValue) {
                intensitySlider.addEventListener('input', function() {
                    intensityValue.textContent = this.value;
                });
            }
        }
    }, 1500);
}

function runMockGreeting() {
    const name = document.getElementById('mock-name').value || 'World';
    const intensity = document.getElementById('mock-intensity').value;
    const output = document.getElementById('mock-output');
    
    const greeting = "Hello, " + name + "!" + "!".repeat(intensity - 1);
    output.textContent = greeting;
    output.style.background = '#e8f5e8';
}

function runMockCalculator() {
    const num1 = parseFloat(document.getElementById('calc-num1').value) || 0;
    const num2 = parseFloat(document.getElementById('calc-num2').value) || 0;
    const operation = document.getElementById('calc-op').value;
    const output = document.getElementById('calc-output');
    
    let result;
    switch (operation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            result = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
            break;
        default:
            result = 'Invalid operation';
    }
    
    output.textContent = result;
    output.style.background = '#e8f5e8';
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block') || button.closest('.code-editor');
    const code = codeBlock.querySelector('pre code') || codeBlock.querySelector('.editor-content');
    
    let textToCopy = '';
    
    if (code.tagName === 'CODE') {
        textToCopy = code.textContent;
    } else {
        // For Monaco editor
        const editorId = code.id.replace('editor', '');
        const editor = editors[editorId];
        if (editor) {
            textToCopy = editor.getValue();
        }
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

function showComponent(componentType) {
    // Remove active class from all cards
    document.querySelectorAll('.component-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to clicked card
    event.target.closest('.component-card').classList.add('active');
    
    const demo = componentDemos[componentType];
    const demoArea = document.querySelector('#componentDemo .demo-area');
    
    if (demo && demoArea) {
        demoArea.innerHTML = `
            <div class="component-detail">
                <h4>${demo.title}</h4>
                <p>${demo.description}</p>
                <div class="component-code">
                    <h5>Code:</h5>
                    <pre><code>${demo.code}</code></pre>
                </div>
                <div class="component-preview">
                    <h5>Preview:</h5>
                    ${demo.demo}
                </div>
            </div>
        `;
    }
}

// Chatbot functionality
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatContainer = document.getElementById('chatContainer');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">${message}</div>
    `;
    chatContainer.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            `That's interesting! You said: "${message}"`,
            `I understand you mentioned: ${message}`,
            `Thanks for sharing: ${message}`,
            `Tell me more about: ${message}`,
            `Great question about: ${message}`,
            `I'd love to help you with: ${message}`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">${randomResponse}</div>
        `;
        chatContainer.appendChild(botMessage);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function restartCourse() {
    if (confirm('Are you sure you want to restart the course? This will reset your progress.')) {
        completedModules.clear();
        currentModule = 1;
        localStorage.removeItem('gradio-learning-progress');
        updateProgress();
        scrollToSection('hero');
        showNotification('Course restarted! 🚀');
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #4a90e2, #ff6b35);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for mock interfaces
const mockInterfaceStyles = `
<style>
.mock-gradio-interface {
    background: white;
    border: 2px solid #e1e8ed;
    border-radius: 12px;
    padding: 1.5rem;
    font-family: 'Inter', sans-serif;
}

.mock-gradio-interface h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.25rem;
    text-align: center;
}

.mock-inputs {
    margin-bottom: 1.5rem;
}

.mock-input-group {
    margin-bottom: 1rem;
}

.mock-input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.875rem;
}

.mock-input-group input,
.mock-input-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.875rem;
    font-family: inherit;
}

.mock-input-group input[type="range"] {
    padding: 0;
}

.mock-submit {
    background: #ff6b35;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    transition: background 0.3s ease;
}

.mock-submit:hover {
    background: #e55a2b;
}

.mock-outputs label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.875rem;
}

.mock-output {
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.75rem;
    min-height: 2.5rem;
    color: #2c3e50;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
}

.preview-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
    font-style: italic;
}

.component-detail {
    text-align: left;
}

.component-detail h4 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.component-detail p {
    color: #666;
    margin-bottom: 1.5rem;
}

.component-code,
.component-preview {
    margin-bottom: 1.5rem;
}

.component-code h5,
.component-preview h5 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.component-code pre {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.75rem;
    overflow-x: auto;
}

.component-live-demo {
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1rem;
}

.component-live-demo label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.875rem;
}

.demo-textbox,
.demo-number {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
}

.demo-slider {
    width: 100%;
    margin: 0.5rem 0;
}

.demo-image-upload,
.demo-audio-upload,
.demo-file-upload {
    border: 2px dashed #ddd;
    border-radius: 6px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
}

.demo-image-upload:hover,
.demo-audio-upload:hover,
.demo-file-upload:hover {
    border-color: #4a90e2;
}

.upload-placeholder {
    color: #666;
    font-size: 0.875rem;
}
</style>
`;

// Inject mock interface styles
document.head.insertAdjacentHTML('beforeend', mockInterfaceStyles);

