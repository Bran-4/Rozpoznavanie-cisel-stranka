 // Setup canvas and context
 const canvas = document.getElementById('drawingCanvas');
 const ctx = canvas.getContext('2d');

 // Scale canvas to be easier to draw on (visual scaling, not actual data)
 canvas.style.width = '400px';
 canvas.style.height = '400px';
 ctx.scale(1, 1);

 let drawing = false;

 // Event listeners for mouse actions
 canvas.addEventListener('mousedown', () => drawing = true);
 canvas.addEventListener('mouseup', () => drawing = false);
 canvas.addEventListener('mouseleave', () => drawing = false);
 canvas.addEventListener('mousemove', draw);

 function colorSurroundingPixels(x, y) {
    // Loop over the surrounding pixels in a small area (3x3 around the central pixel)
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skip the center pixel

            let newX = x + i;
            let newY = y + j;

            // Make sure we're within canvas bounds
            if (newX >= 0 && newX < 28 && newY >= 0 && newY < 28) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 50% black
                ctx.fillRect(newX, newY, 1, 1); // Color the surrounding pixel
            }
        }
    }
}

 function draw(event) {
     if (!drawing) return;

     // Get mouse position on the canvas
     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((event.clientX - rect.left) / (rect.width / 28));
     const y = Math.floor((event.clientY - rect.top) / (rect.height / 28));

     // Draw a black rectangle (pixel) at the mouse position
     ctx.fillStyle = 'black';
     ctx.fillRect(x, y, 1, 1); // Drawing in actual canvas size (28x28)
     colorSurroundingPixels(x, y);
 }


 // Button to extract pixel data
 document.getElementById('getPixelData').addEventListener('click', () => {
     const imageData = ctx.getImageData(0, 0, 28, 28).data;
     const pixelData = [];

     // Loop through every pixel in the canvas
     for (let i = 0; i < imageData.length; i += 4) {
         const [r, g, b, a] = [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
         // If the pixel is black (r, g, b values close to 0), push 1, else 0
         
        pixelData.push(a/255); // 50% black
     }
    
     function relu(x){
         if(x>0){
             return x;
         }
         return 0;
     }
     function softmax(zozn,dlzka){
         let max=0;
         let sum=0;
         for(let i=0;i<dlzka;i++){
             if(max<zozn[i]){
                 max=zozn[i];
             }
         }
         for (let i=0;i<dlzka;i++){
             sum+=Math.exp(zozn[i]-max);
         }
         for(let i=0;i<dlzka;i++){
             zozn[i]=(Math.exp(zozn[i]-max))/sum;
         }
     }
     function findmax(zozn,dlzka){
         let max=0;
         let index=0;
         for(let i=0;i<dlzka;i++){
             if(max<zozn[i]){
                 max=zozn[i];
                 index=i;
             }
         }
         return index;
     }

     function uhadni(){
         let zoznam=[];
         let weighted_sum=0;
         let index=0;
         for(let neuron=0;neuron<10;neuron++){
             weighted_sum=0;
             index=0;
             for(let i=784*neuron;i<=784*neuron+783;i++){
                 weighted_sum+=weights[i]*pixelData[index];
                 index+=1;
             }
             weighted_sum+=bias[neuron];
             zoznam[neuron]=relu(weighted_sum);
         }
         softmax(zoznam,10)
         document.getElementById("outputDiv").textContent=findmax(zoznam,10);
     }

     uhadni();
     /*const grid = [];
     for (let i = 0; i < 28; i++) {
         grid.push(pixelData.slice(i * 28, (i + 1) * 28));
     }
     document.getElementById('output').textContent = grid.map(row => row.join(' ')).join('\n');
 */
 });
 const mojDiv = document.getElementById('center-');
 const mojeTlacitko = document.getElementById('getPixelData');

 // Získanie pôvodnej výšky divu
 const povodnaVyska = mojDiv.clientHeight;

 mojeTlacitko.addEventListener('mouseenter', () => {
     mojDiv.style.height = `${povodnaVyska + 35}px`; // Zväčšenie výšky o 10px
 });
 mojeTlacitko.addEventListener('mouseleave', () => {
    mojDiv.style.height = `${povodnaVyska}px`; // Návrat do pôvodnej výšky
});