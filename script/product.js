document.addEventListener("DOMContentLoaded", function () {
  validateSize("col1", "row2");

  elemForm();

  let cnt = 1;
  let btn = document.getElementById("calc");
  btn.addEventListener("click", function () {
    let mat1 = [];
    let mat2 = [];
    let elems = document.getElementsByClassName("elem");
    for (let i = 0, len = elems.length; i < len; i++) {
      let elem = elems.item(i);
      let id = elem.id;
      let p = /elem([1-2])([1-5])([1-5])/;
      let match = id.match(p);
      if (match[1] === "1") {
        if (mat1.length < match[2]) {
          mat1.push([]);
        }
        mat1[match[2] - 1][match[3] - 1] = +elem.value;
      } else if (match[1] === "2") {
        if (mat2.length < match[2]) {
          mat2.push([]);
        }
        mat2[match[2] - 1][match[3] - 1] = +elem.value;
      }
    }

    let output = document.getElementById("output");
    let product = getProduct(mat1, mat2);
    let inner = document.createElement("div");
    inner.className = "result-inner";
    setGridCol(inner, product[0].length);
    product.forEach(function (row, index, array) {
      row.forEach(function (elem, index, array) {
        let p = document.createElement("p");
        p.className = "result";
        let text = document.createTextNode(elem);
        p.appendChild(text);
        inner.appendChild(p);
      });
    });

    let outer = document.createElement("div");
    outer.className = "result-outer";
    let num = document.createTextNode(cnt + ".");
    outer.appendChild(num);
    outer.appendChild(inner);
    let disp = document.getElementById("disp");
    if (cnt === 1) {
      disp.appendChild(outer);
    } else {
      disp.insertBefore(outer, disp.firstChild);
    }
    setMaxNodes(disp, 5);
    cnt++;
  });

  //２つの行列の積を計算
  function getProduct(mat1, mat2) {
    let l = mat1.length;
    let m = mat1[0].length;
    let n = mat2[0].length;
    let product = [];

    if (mat2.length !== m) {
      return "!!Check the size of your matrices";
    }

    for (let i = 1 - 1; i < l; i++) {
      product[i] = [];
      for (let k = 1 - 1; k < n; k++) {
        sum = 0;
        for (let j = 1 - 1, len = m; j < len; j++) {
          if (
            typeof mat1[i][j] !== "number" ||
            typeof mat2[j][k] !== "number"
          ) {
            return "!!Numbers only";
          }
          sum += mat1[i][j] * mat2[j][k];
        }
        product[i][k] = sum;
      }
    }
    return product;
  }

  //grid-template-columnsの値を設定
  function setGridCol(elem, cols, width = "100px") {
    let str0 = " " + width;
    let str = str0.repeat(cols);
    str = str.trim();
    elem.style.gridTemplateColumns = str;
  }

  //childNodesの最大数を設定
  function setMaxNodes(elem, max) {
    while (elem.childNodes.length > max) {
      elem.removeChild(elem.lastChild);
    }
  }

  //第１行列の列数と第２行列の行数を揃える
  function validateSize(idCol1, idRow2) {
    let col1 = document.getElementById(idCol1);
    let row2 = document.getElementById(idRow2);
    col1.addEventListener("change", function () {
      row2.value = col1.value;
    });
    row2.addEventListener("change", function () {
      col1.value = row2.value;
    });  
  }

  function elemForm() {
    let sizeForms = ["sizeForm1", "sizeForm2"]; //
    let p = /sizeForm([12])/;
    sizeForms.forEach(function (sizeForm, index, array) {
      let match = sizeForm.match(p);
      let mat = match[1];
  
      let clazzes = document.getElementsByClassName(sizeForm);
      for (let n = 0, len = clazzes.length; n < len; n++) {
        let clazz = clazzes.item(n);
        clazz.addEventListener("change", function () {
          let row = document.getElementById("row" + mat).value;
          let col = document.getElementById("col" + mat).value;
          let id = "elem" + mat;
          let frag = createElemForm(row, col, id);
          let div = document.createElement("div");
          div.appendChild(frag);
          let elemForm = document.getElementById("elemForm" + mat);
          elemForm.replaceChild(div, elemForm.lastElementChild);
        });
      }
  
      //行列のサイズに応じて成分入力フォームを生成
      function createElemForm(row, col, id = "elem") {
        let frag = document.createDocumentFragment();
        for (let i = 1, len = row; i <= len; i++) {
          for (let j = 1, len = col; j <= len; j++) {
            let input = document.createElement("input");
            input.id = id + i + j;
            input.className = "elem";
            input.type = "text";
            input.size = "5";
            input.placeholder = "0";
            frag.appendChild(input);
          }
          let br = document.createElement("br");
          if (i < len) {
            frag.appendChild(br);
          }
        }
        return frag;
      }
    });
  }
  
});
