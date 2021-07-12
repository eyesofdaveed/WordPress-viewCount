/* Registers the click per user's session and retrieve the id of the product clicked */
function clickCounter(productId, viewCount) {
  if (!sessionStorage.alreadyClicked) {
    let viewCountNum = parseInt(viewCount) + 1;
    let data = {
      product_id: `${productId}`,
      view_count: `${viewCountNum}`,
      last_purchased_date: "11",
    };
    console.log(data);

    jQuery
      .ajax({
        type: "PUT",
        url: "http://localhost:5000",
        contentType: "application/json",
        data: JSON.stringify(data), // access in body
      })
      .done(function () {
        console.log("SUCCESS");
        sessionStorage.alreadyClicked = 1;
      })
      .fail(function (msg) {
        console.log("FAIL");
        sessionStorage.alreadyClicked = 1;
      });
  }
  return;
}

/* Sets an attribute for all available products on the page */
jQuery(document).ready(($) => {
  var obj = $("li.product");
  var productList = $.makeArray(obj);

  var databaseConnection = $.get("http://localhost:5000/", () => {
    console.log("Succesfully connected to the database");
  })
    .done(function () {
      console.log("Fetching the data");
      dataFromServer = databaseConnection.responseJSON;

      productList.forEach((product) => {
        let productId = product.classList[2].replace("post-", "");

        dataFromServer.forEach((item) => {
          if (productId == item.product_id) {
            viewCountBox = document.createElement("p");
            product.setAttribute(
              "onclick",
              `clickCounter(${productId}, ${item.view_count})`
            );
            viewCountBox.innerHTML = `View count: ${item.view_count}`;
            product.appendChild(viewCountBox);
          }
        });
      });
    })
    .fail(function () {
      console.log("Couldn't connect to the database");
    });
});
