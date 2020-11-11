import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getAllProducts, deleteProduct } from "./helper/adminapicall";
import Loading from "../core/Loading";
import ErrorToast from "../core/ErrorToast";
import queryString from "query-string";

const ManageProduct = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { user, token } = isAuthenticated();
	const [query, setQuery] = useState({
		sortBy: "price",
		ascDesc: "asc",
		limit: 8,
		skip: 0,
	});

	// Destructuring
	const { sortBy, ascDesc, limit } = query;

	const preload = () => {
		setLoading(true);
		getAllProducts().then((data) => {
			setLoading(false);
			if (data.error) {
				setError(data.error);
				console.log(data.error);
			} else {
				setProducts(data);
			}
		});
	};

	useEffect(() => {
		preload();
	}, []);

	const deleteThisProduct = (productId) => {
		setLoading(true);
		deleteProduct(user._id, productId, token)
		.then((data) => {
				setLoading(false);
				if (data.error) {
					console.log(data.error);
					setError(data.error);
				} else {
					preload();
				}
			})
			.catch((err) => {
				setLoading(false);
				setError(err);
				console.log(err)
			});
	};

	const showProducts = () => {
		return products.map((product, index) => {
			return (
				<div key={index}>
					<div className="row text-center text-muted">
						<div className="col-8 pl-5">
							<h4 className="text-left" style={{ textTransform: "capitalize" }}>
								{product.name}
							</h4>
						</div>
						<div className="col-2">
							<Link
								className="btn btn-success rounded"
								to={`/admin/product/update/${product._id}`}
							>
								<span className="">Update</span>
							</Link>
						</div>
						<div className="col-2">
							<button
								onClick={() => {
									deleteThisProduct(product._id);
								}}
								className="btn btn-danger rounded"
							>
								Delete
							</button>
						</div>
					</div>
					<hr />
				</div>
			);
		});
	};

		/* Filter Section START */

	//Handle Change
	const handleChange = (fieldName) => (e) => {
		setQuery({ ...query, [fieldName]: e.target.value });
	};

	//Filter
	const filter = () => {
		setLoading(true)
		const queryStringified = queryString.stringify(query);
		return getAllProducts(queryStringified)
			.then((data) => {
				if (data.error) {
					setLoading(false)
					setError(data.error)
				} else {
					setProducts(data);
					setLoading(false)
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false)
				setError(err)
			});
	};

	const filterSection = () => {
		return (
			<div
				className="p-3 my-2 mx-auto bg-light text-dark rounded"
			>
				<div className="d-flex justify-content-around flex-column flex-md-row">
					<div>
						<label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
							Sort By
						</label>
						<select
							className="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
							value={sortBy}
							onChange={handleChange("sortBy")}
						>
							<option value="name">Name</option>
							<option value="updatedAt">Last Update</option>
							<option value="price">Price</option>
							<option value="stock">Qty in Stock</option>
							<option value="sold">Qty Sold</option>
						</select>
					</div>
					<div className="my-2 my-md-0">
						<label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
							Order
					</label>
						<select
							className="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
							value={ascDesc}
							onChange={handleChange("ascDesc")}
						>
							<option value="asc">Ascending</option>
							<option value="desc">Descending</option>
						</select>
					</div>
					<div className="my-2 my-md-0">
						<label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
							Limit
						</label>
						<select
							className="custom-select mr-sm-2"
							id="inlineFormCustomSelect"
							value={limit}
							onChange={handleChange("limit")}
						>
							<option value="3">3</option>
							<option value="5">5</option>
							<option value="8">8</option>
							<option value="12">12</option>
							<option value="16">16</option>
							<option value="20">20</option>
						</select>
					</div>
					<button
						className="btn btn-info rounded mt-4 mt-md-auto"
						style={{ minWidth: "150px" }}
						onClick={filter}
					>
						Filter
					</button>
				</div>
			</div>
		);
	};

	/* Filter Section END */

	return (
		<Base
			title="Manage Product Page"
			description="Manage products here"
			className="container bg-white rounded p-4"
		>
			<Link className="btn btn-info rounded" to={`/admin/dashboard`}>
				<span className="">Admin Home</span>
			</Link>
			<h2 className="mb-4 text-center">All Products</h2>
			{filterSection()}
			<Loading loading={loading} />
			<ErrorToast error={error} />
			<div className="row">
				<div className="col-12">
					<h4 className="text-left text-warning my-3">
						Total Products: {products.length}
					</h4>
					{showProducts()}
				</div>
			</div>
		</Base>
	);
};

export default ManageProduct;
