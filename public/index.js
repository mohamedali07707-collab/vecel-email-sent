document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const responseMsg = document.getElementById('responseMessage');
            responseMsg.innerText = "جاري الإرسال...";
            
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                responseMsg.innerText = result.message;
                if(result.success) document.getElementById('contactForm').reset();
            } catch (error) {
                responseMsg.innerText = "حدث خطأ أثناء الاتصال بالسيرفر.";
            }
        });