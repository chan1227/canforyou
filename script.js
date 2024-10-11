// 기존 quotes 배열 및 openCan 함수는 그대로 유지
const quotes = [
    "하루 긍정 일기 쓰기",
    "새로운 기술 학습",
    "1일 1책 읽기",
    "감사 노트 작성",
    "릴스 금지(캔두 제외!)",
    "새로운 장소에서 혼자 식사하기",
    "하루 계획 세우고 실천하기",
    "새로운 운동 도전하기",
    "영어뉴스 번역해보기",
    "10명에게 미소와 인사 건네기"
];

// 파티클 설정
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function Particle(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.angle = Math.random() * 360; // 선 모양 효과를 위한 각도 추가
}

Particle.prototype.update = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size *= 0.97;  // 파티클 크기가 천천히 줄어듭니다
};

Particle.prototype.draw = function() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 10;  // 선의 두께 조정
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(this.angle) * 10, this.y + Math.sin(this.angle) * 10); // 선 모양 파티클
    ctx.stroke();
};

function createParticles(x, y) {
    const numberOfParticles = 50;  // 파티클 수를 기본으로 유지
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 5 + 1;  // 파티클 크기 (작고 부드럽게)
        const color = `rgba(255, 255, 255, 0.8)`;  // 파티클을 흰색으로 고정
        const speedX = (Math.random() - 0.5) * 2;  // 좌우로 넓게 퍼지도록 조정
        const speedY = -Math.random() * 3 - 1;  // 파티클의 속도를 문구 올라오는 속도와 맞춤
        particles.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        // 파티클이 충분히 작아지면 배열에서 제거
        if (particles[i].size < 0.5) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();  // 애니메이션 루프 시작

function openCan() {
    // Play the can opening sound
    const canSound = document.getElementById('canSound');
    canSound.play();

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = quotes[randomIndex];

    // Display the quote
    const quoteDiv = document.getElementById('quote');
    quoteDiv.innerText = quoteText;

    // 애니메이션 효과를 재실행하기 위해 기존 클래스를 제거하고 다시 추가
    quoteDiv.classList.remove('quote');
    void quoteDiv.offsetWidth;  // 트릭: 클래스를 다시 적용하기 위해 강제로 리플로우 발생
    quoteDiv.classList.add('quote');

    // 파티클 생성 (문구 아래쪽에서 발생하도록 위치 설정)
    const quoteRect = quoteDiv.getBoundingClientRect();
    const centerX = quoteRect.left + quoteRect.width / 2;
    const belowQuoteY = quoteRect.bottom;  // 문구 아래쪽에 위치하도록 설정
    createParticles(centerX, belowQuoteY);  // 문구 아래쪽에서 파티클 발생
}
