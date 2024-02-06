const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin");
const winnerDisplay = document.getElementById("winner");

const segments = 24;
const names = ["Паша", "Даник"];
const colors = ["#FFD700", "#DAA520"]; // Желтый и золотой для визуального различия
let currentRotation = 0;

let image1 = new Image(50, 50); // Создание объекта для первого изображения
image1.src = "pasha.png"; // Путь к первому изображению

let image2 = new Image(50, 50); // Создание объекта для второго изображения
image2.src = "danik.png"; // Путь ко второму изображению

function drawWheel() {
  const radius = 400; // Актуальный радиус колеса
  for (let i = 0; i < segments; i++) {
    // Отрисовка сегмента (как раньше)
    ctx.beginPath();
    ctx.moveTo(425, 425); // Центр канваса для нового размера
    ctx.arc(
      425,
      425,
      radius,
      (i * 2 * Math.PI) / segments,
      ((i + 1) * 2 * Math.PI) / segments
    );
    ctx.lineTo(425, 425);
    ctx.fillStyle = colors[i % 2];
    ctx.fill();

    ctx.save();
    const angle = ((i + 0.5) * 2 * Math.PI) / segments;
    const textRadius = radius * 0.75;
    const textX = 425 + textRadius * Math.cos(angle);
    const textY = 425 + textRadius * Math.sin(angle);

    ctx.translate(textX, textY);
    ctx.rotate(angle + Math.PI / 2);

    // Выбор изображения в зависимости от индекса сегмента
    let image = i % 2 === 0 ? image1 : image2;

    // Расчет положения для изображения, чтобы оно отображалось над текстом
    const imageX = -25; // Центрируем изображение по горизонтали относительно текста
    const imageY = -50 - 25; // Сдвигаем наверх от текста, учитывая высоту текста и небольшой отступ

    // Отрисовка выбранного изображения, если оно загружено
    if (image.complete) {
      ctx.drawImage(image, imageX, imageY, 50, 50); // Отрисовка изображения размером 50x50 пикселей
    }

    // Отрисовка текста (как раньше)
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(names[i % 2], 0, 0);

    ctx.restore();
  }
}

function spinWheel() {
  const rotationDegrees = Math.floor(Math.random() * 360) + 720; // Минимум 2 полных оборота
  const finalAngle = rotationDegrees;
  let currentDegrees = 0; // Сбрасываем текущий угол перед началом анимации

  const animateSpin = () => {
    if (currentDegrees < finalAngle) {
      currentDegrees += 3; // Скорость вращения
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка канваса перед каждым кадром
      ctx.save();
      ctx.translate(425, 425); // Центрирование колеса
      ctx.rotate((currentDegrees * Math.PI) / 180); // Применение поворота
      ctx.translate(-425, -425); // Возврат к исходному состоянию
      drawWheel(); // Перерисовка колеса
      ctx.restore(); // Возвращаем контекст к исходному состоянию после рисования
      requestAnimationFrame(animateSpin);
    } else {
      // Определение победителя после остановки колеса
      const winnerIndex = Math.floor(
        ((finalAngle % 360) / (360 / segments)) % 2
      );
      const winnerName = names[winnerIndex];
      winnerDisplay.innerText = winnerName;
    }
  };
  animateSpin();
}

image1.onload = image2.onload = function () {
  // Проверка, загружены ли оба изображения, затем запуск анимации
};

drawWheel(); // Нарисовать колесо при загрузке страницы

spinButton.addEventListener("click", spinWheel);
