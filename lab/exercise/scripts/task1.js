function ChangeHTML(){
  let oldParagraph=document.getElementById('Par1');
  let newParagraph = "";

  for(let i = 0;i<10;i++){
    newParagraph += "This is a new paragraph, Paragraph" + ""+ i;
  }
  oldParagraph.innerHTML=newParagraph;
}
