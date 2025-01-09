const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#DBA3AC';
ctx.fillRect(200, 70, 400, 300);

ctx.globalAlpha = 0.6;

ctx.fillStyle = '#8FF0AD'; 
ctx.fillRect(350, 150, 400, 300);