const fs = require('fs');

const file = 'c:/Users/hp/Downloads/what not backup 01-05-2024/src/pages/Products/Products.js';
let content = fs.readFileSync(file, 'utf8').split('\r\n').join('\n');

// replace 1
content = content.replace(`  const DeleteBanner = data => {
    var token = datas
    var remid = { product_id: data._id }
    axios
      .post(URLS.deleteProduct, remid, {
        headers: { Authorization: \`Bearer \${token}\` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      DeleteBanner(data)
    }
  }`.split('\r\n').join('\n'), `  const manageBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast("Please select at least one product to delete.")
      return
    }
    const confirmBox = window.confirm("Do you really want to Delete the selected products?")
    if (confirmBox === true) {
      let successCount = 0;
      for (const id of selectedProducts) {
        var token = datas
        var remid = { product_id: id }
        try {
          const res = await axios.post(URLS.deleteProduct, remid, {
            headers: { Authorization: \`Bearer \${token}\` },
          })
          if (res.status === 200) {
            successCount++;
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      }
      if (successCount > 0) {
        toast(\`\${successCount} product(s) deleted successfully.\`)
        setSelectedProducts([])
        GetAllBanners()
      }
    }
  }`);

// replace 2
content = content.replace(`  const [search, setsearch] = useState([])

  const searchAll = e => {`.split('\r\n').join('\n'), `  const [search, setsearch] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleCheckboxChange = (e, productId) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    }
  }

  const handleSelectAll = (e) => {
    const currentPageIds = lists.map(item => item._id)
    if (e.target.checked) {
      const newSelected = new Set([...selectedProducts, ...currentPageIds])
      setSelectedProducts(Array.from(newSelected))
    } else {
      setSelectedProducts(selectedProducts.filter(id => !currentPageIds.includes(id)))
    }
  }

  const searchAll = e => {`);

// replace 3
content = content.replace(`                          <Col md={6}>
                            <Button
                              className="m-1"
                              onClick={() => {
                                setfilter(!filter)
                              }}
                              color="primary"
                            >
                              <i className="fas fa-filter"></i> Add Product
                            </Button>
                          </Col>`.split('\r\n').join('\n'), `                          <Col md={6}>
                            <Button
                              className="m-1"
                              onClick={() => {
                                setfilter(!filter)
                              }}
                              color="primary"
                            >
                              <i className="fas fa-filter"></i> Add Product
                            </Button>
                            <Button
                              className="m-1"
                              onClick={manageBulkDelete}
                              color="danger"
                            >
                              <i className="bx bx-trash"></i> Delete
                            </Button>
                          </Col>`);

// replace 4
content = content.replace(`                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Brand Name </th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Incentive </th>
                                <th>Serial Number </th>
                                <th>Ean Code</th>
                                <th>SKU Id</th>
                                <th>Description</th>
                                <th>Action</th>
                              </tr>
                            </thead>`.split('\r\n').join('\n'), `                            <thead>
                              <tr>
                                <th>
                                  <Input 
                                    type="checkbox" 
                                    onChange={handleSelectAll} 
                                    checked={lists.length > 0 && lists.every(item => selectedProducts.includes(item._id))} 
                                  />
                                </th>
                                <th>S.No</th>
                                <th>Brand Name </th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Incentive </th>
                                <th>Serial Number </th>
                                <th>Ean Code</th>
                                <th>SKU Id</th>
                                <th>Description</th>
                                <th>Action</th>
                              </tr>
                            </thead>`);

// replace 5
content = content.replace(`                            <tbody>
                              {lists.map((data, key) => (
                                <tr key={key}>
                                  <th>{(pageNumber - 1) * 5 + key + 6}</th>
                                  <td>{data.brandName}</td>
                                  <td>{data.categoryName}</td>
                                  <td>{data.name}</td>
                                  <td>{data.price}</td>
                                  <td>{data.incentive}</td>
                                  <td>{data.serialNumber}</td>
                                  <td>{data.EANcode}</td>
                                  <td>{data.SKUid}</td>
                                  <td>{data.description}</td>
                                  <td>
                                    <Button
                                      onClick={() => {
                                        getpopup(data)
                                      }}
                                      className="mr-2"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="success"
                                      outline
                                    >
                                      <i className="bx bx-edit "></i>
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        manageDelete(data)
                                      }}
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="danger"
                                      outline
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>`.split('\r\n').join('\n'), `                            <tbody>
                              {lists.map((data, key) => (
                                <tr key={key}>
                                  <td>
                                    <Input 
                                      type="checkbox" 
                                      checked={selectedProducts.includes(data._id)}
                                      onChange={(e) => handleCheckboxChange(e, data._id)}
                                    />
                                  </td>
                                  <th>{(pageNumber - 1) * 5 + key + 6}</th>
                                  <td>{data.brandName}</td>
                                  <td>{data.categoryName}</td>
                                  <td>{data.name}</td>
                                  <td>{data.price}</td>
                                  <td>{data.incentive}</td>
                                  <td>{data.serialNumber}</td>
                                  <td>{data.EANcode}</td>
                                  <td>{data.SKUid}</td>
                                  <td>{data.description}</td>
                                  <td>
                                    <Button
                                      onClick={() => {
                                        getpopup(data)
                                      }}
                                      className="mr-2"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="success"
                                      outline
                                    >
                                      <i className="bx bx-edit "></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>`);

fs.writeFileSync(file, content);
console.log('Done!');