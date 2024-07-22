
//import ocr from './utils/ocrT'
//const ocr = require('./utils/ocr')

// Creating Global variables to store data 

//let fixedText = "This is a fixed string that will be displayed in the textarea.";
let selectedOption = ''; // lanaguage
let output = '';  // code output
let ocrReaded = ''; // ocr value
let imageUrl = '';  // image url

// Endpoint Credentials 
let clientID = "b9d770f12395ba52190a3cea4f7915a6"
let clientSecret ="792cdd9287a2ea017e9aaa4e3b7083a921918a9a485cdfad3900388625bf29a2"


// Upload btn configs
document.getElementById('uploadButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    //const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl = e.target.result;
            document.getElementById('toggleImageButton').style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
    let reader = new FileReader();
    
    reader.onload = function(e) {
        Tesseract.recognize(
            e.target.result,
            'eng'
        ).then(({ data: { text } }) => {
            console.log(text);
            ocrReaded = text;
        }).catch(err => {
            console.error(err);
            resultDiv.innerHTML = 'Error processing image!';
        });
    };
    reader.readAsDataURL(file);
});


document.getElementById('toggleImageButton').addEventListener('click', () => {
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview.style.display === 'none' || imagePreview.style.display === '') {
        const img = document.createElement('img');
        img.src = imageUrl;
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
        imagePreview.style.display = 'block';
        document.getElementById('toggleImageButton').textContent = '⬆️';
    } else {
        imagePreview.style.display = 'none';
        document.getElementById('toggleImageButton').textContent = '⬇️';
    }
});

document.getElementById('showTextButton').addEventListener('click', () => {


    const textarea = document.createElement('textarea');
    textarea.value = ocrReaded;
    //logic: We want realtime input of user
    textarea.addEventListener('input', (event) => {
        ocrReaded = event.target.value; // Update variable with user input
    });
    document.getElementById('fixedTextArea').innerHTML = '';
    document.getElementById('fixedTextArea').appendChild(textarea);
    document.getElementById('fixedTextArea').style.display = 'block';
    document.getElementById('toggleTextButton').style.display = 'inline-block';
});

document.getElementById('toggleTextButton').addEventListener('click', () => {
    const fixedTextArea = document.getElementById('fixedTextArea');
    if (fixedTextArea.style.display === 'none' || fixedTextArea.style.display === '') {
        fixedTextArea.style.display = 'block';
        document.getElementById('toggleTextButton').textContent = '⬆️';
    } else {
        fixedTextArea.style.display = 'none';
        document.getElementById('toggleTextButton').textContent = '⬇️';
    }
});

document.getElementById('showDropdownTextButton').addEventListener('click', () => {
    let program = {
        script: ocrReaded,
        language: selectedOption,
        versionIndex: "0",
        stdin: '',
        clientId: clientID,
        clientSecret: clientSecret
    };
   
    fetch('http://localhost:3001/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(program)
            })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    alert('Network response was not ok!!! ')
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data.output);
                if(data.output.includes('error')){
                    alert('Please edit the script!!!');
                    output='Following are the errors!! \n '+ data.output;

                }else{
                    output = data.output;
                }
                
                // output = JSON.stringify(data, null, 2);
                // console.log(output);
               // document.getElementById('response').textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert(error)
            });
    document.getElementById('manualTextarea').value = output; // Example transformation
    document.getElementById('dropdownTextArea').style.display = 'block';
    document.getElementById('toggleDropdownTextButton').style.display = 'inline-block';
});

document.getElementById('toggleDropdownTextButton').addEventListener('click', () => {
    const dropdownTextArea = document.getElementById('dropdownTextArea');
    if (dropdownTextArea.style.display === 'none' || dropdownTextArea.style.display === '') {
        dropdownTextArea.style.display = 'block';
        document.getElementById('toggleDropdownTextButton').textContent = '⬆️';
    } else {
        dropdownTextArea.style.display = 'none';
        document.getElementById('toggleDropdownTextButton').textContent = '⬇️';
    }
});

document.getElementById('dropdown').addEventListener('change', (event) => {
    selectedOption = event.target.value; // Update backend variable with selected option
    console.log(selectedOption);
});
