const plain = document.getElementById('plain')
const encrypt = document.getElementById('encrypt')
const key = document.getElementById('key')
const secret = document.getElementById('encrypted')
const decrypt = document.getElementById('decrypt')
const lang = document.getElementById('lang')

let square1, square2

plain.value = localStorage.getItem('text')
//secret.value = localStorage.getItem('encrypted')
lang.value = 'English'

function selectLang()
{
    let check = document.getElementById('check')
    if(check.checked === true) lang.value = 'Русский'
    else lang.value = 'English'
    return check.checked
}

function showFile(input)
{

    let file = input.files[0]
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function()
    {
        plain.value = reader.result
        localStorage.setItem('text', plain.value)
    }
}

encrypt.addEventListener('click', function()
{
    if(key.value === ''){
        alert('Введите ключ')
    }
    else{
        let tmpUniqueKey = Array.from(new Set((key.value).toLowerCase())).join('')
        let uniqueKey = tmpUniqueKey.split('')
        let checkLang = selectLang()
        let tmpAlph
        if(!checkLang)
        {
            tmpAlph = "abcdefghijklmnopqrstuvwxyz_.!0123456"
        }
        else
        {
            tmpAlph = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя_.!"
        }

        let alph = tmpAlph.split('')
        let encr1, encr2
        let encrypted = []
        let rows1 = [], cols1 = [], rows2 = [], cols2 = []
        let row1, row2, col1, col2
        
        alph = alph.filter((e) => !~uniqueKey.indexOf(e));
    
        let flatSquare1 = uniqueKey.concat(alph)
        let flatSquare2 = alph.concat(uniqueKey)
    
        square1 = flatSquare1.map((_, i, a) => a.slice(i * 6, i * 6 + 6)).filter((el) => el.length);
        square2 = flatSquare2.map((_, i, a) => a.slice(i * 6, i * 6 + 6)).filter((el) => el.length);
        

        let orig = (plain.value).toLowerCase().split('')
        orig = orig.filter((el) => el !== '\n').map((el) => (el === ' ' || el === ',') ? el = '_' : el)
        
        if(orig.length % 2 !== 0){
            orig.push('_')
        }

        for(let i = 0; i < orig.length; ++i)
        {
            if((i + 1) % 2 !== 0){
                row1 = square1.findIndex(row1 => row1.includes(orig[i]))
                col1 = square1[row1].indexOf(orig[i])

                rows1.push(row1)
                cols1.push(col1)
                //console.log(orig[i], ' ',row1, ' ', col1, ' ', square1)
            }
            else if((i + 1) % 2 === 0){
                row2 = square2.findIndex(row2 => row2.includes(orig[i]))
                col2 = square2[row2].indexOf(orig[i])

                rows2.push(row2)
                cols2.push(col2)

                //console.log(orig[i], ' ',row2, ' ', col2, ' ', square2)
            }
            
            
        }

        for(let i = 0; i < rows1.length; ++i)
        {
            if(rows1[i] !== rows2[i])
            {
                encr1 = square1[rows2[i]][cols1[i]]
                encr2 = square2[rows1[i]][cols2[i]]
                encrypted.push(encr1 + encr2)
            }
            else
            {
                encr1 = square1[rows1[i]][cols2[i]]
                encr2 = square2[rows2[i]][cols1[i]]
                encrypted.push(encr1 + encr2)
            }   
        }
        encrypted = encrypted.join('')
        //localStorage.setItem('encrypted', encrypted)
        secret.value = encrypted

        decrypt.style.display = "block"
    }
 
})

decrypt.addEventListener('click', function()
{
    let encrypted = secret.value
    let decr1, decr2
    let decrypted = []
    let rows1 = [], cols1 = [], rows2 = [], cols2 = []
    let row1, row2, col1, col2

    encrypted = encrypted.split('')

    for(let i = 0; i < encrypted.length; ++i)
        {
            if((i + 1) % 2 !== 0){
                row1 = square1.findIndex(row1 => row1.includes(encrypted[i]))
                col1 = square1[row1].indexOf(encrypted[i])

                rows1.push(row1)
                cols1.push(col1)
                //console.log(orig[i], ' ',row1, ' ', col1, ' ', square1)
            }
            else if((i + 1) % 2 === 0){
                row2 = square2.findIndex(row2 => row2.includes(encrypted[i]))
                col2 = square2[row2].indexOf(encrypted[i])

                rows2.push(row2)
                cols2.push(col2)

                //console.log(orig[i], ' ',row2, ' ', col2, ' ', square2)
            }
        }

    for(let i = 0; i < rows1.length; ++i)
    {
        if(rows1[i] !== rows2[i])
        {
            decr1 = square1[rows2[i]][cols1[i]]
            decr2 = square2[rows1[i]][cols2[i]]
            decrypted.push(decr1 + decr2)
        }
        else
        {
            decr1 = square1[rows1[i]][cols2[i]]
            decr2 = square2[rows2[i]][cols1[i]]
            decrypted.push(decr1 + decr2)
        }  
    }

    decrypted = decrypted.join('').split('').map((el) => el === '_' ? el = ' ' : el).join('')
    secret.value = decrypted

    decrypt.style.display = "none"

})