import database from "../Services/database.js";

export const getAllProduct = async (req, res) => {
  console.log("GET /products is Requested!!");
  try {
    const get_query = ` SELECT p.* ,
                      (
                        SELECT row_to_json(brand_obj)
                        FROM ( SELECT "brandId","brandName"
                              FROM brands
                              WHERE "brandId" = p."brandId" )brand_obj
                      ) AS brand,
                      (
                        SELECT row_to_json(pdt_obj)
                        FROM ( SELECT "pdTypeId","pdTypeName"
                              FROM "pdTypes"	
                              WHERE "pdTypeId"=p."pdTypeId" )pdt_obj
                      )AS pdt
                      FROM products p `;

    const result = await database.query(get_query);
    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.log("Server get Error", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const postProduct = async (req, res) => {
  console.log("POST /products is requested.");
  try {
    const bodyData = req.body;
    if (!bodyData.pdId || !bodyData.pdName) {
      return res.status(422).json({
        message: "Server Error pdId and pdName is required",
      });
    }
    const chkRow = await database.query({
      text: `SELECT * FROM products WHERE "pdId"=$1`,
      values: [req.body.pdId],
    });
    if (chkRow.rowCount != 0) {
      return res.status(409).json({
        message: `ERROR pdId ${req.body.pdId} is  exists`,
      });
    }
    const result = await database.query({
      text: `INSERT INTO "products" ("pdId","pdName","pdPrice","pdTypeId","brandId") VALUES($1,$2,$3,$4,$5)`,
      values: [
        req.body.pdId,
        req.body.pdName,
        req.body.pdPrice,

        req.body.pdTypeId,
        req.body.brandId,
      ],
    });
    const datetime = new Date();
    bodyData.createDate = datetime;
    bodyData.message = "OK";
    res.status(201).json(bodyData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  console.log(`GET /products/id ${req.params.id} is Requested!!`);
  try {
    const result = await database.query({
      text: ` SELECT p.* ,
                      (
                        SELECT row_to_json(brand_obj)
                        FROM ( SELECT "brandId","brandName"
                              FROM brands
                              WHERE "brandId" = p."brandId" )brand_obj
                      ) AS brand,
                      (
                        SELECT row_to_json(pdt_obj)
                        FROM ( SELECT "pdTypeId","pdTypeName"
                              FROM "pdTypes"	
                              WHERE "pdTypeId"=p."pdTypeId" )pdt_obj
                      )AS pdt
                      FROM products p 
                      WHERE p."pdId" = $1 `,
      values: [req.params.id],
    });
    return res.status(200).json(result.rows);
  } catch (err) {
    console.log("Server get Error", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

