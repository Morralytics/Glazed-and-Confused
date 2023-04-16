import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_DONUT_TO_ORDER, UPDATE_ORDER_QUANTITY } from '../../utils/actions';
import { QUERY_GET_DONUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import '../../styles/popup.css'
import { useQuery } from "@apollo/client";

function Popup() {
    const [state, dispatch] = useStoreContext();
    const { id } = useParams();

    const [currentDonut, setCurrentDonut] = useState({});

    const { loading, data } = useQuery(QUERY_GET_DONUT);

    const { donuts, order } = state

    useEffect(() => {
        if (donuts.length) {
            setCurrentDonut(donuts.find((donut) => donut._id === id));
        }
    })


    // Functions for handling donut being added to order
    const addDonutToOrder = () => {
        const donutInOrder = order.find((orderItem) => orderItem._id === _id)
        if (donutInOrder) {
            dispatch({
                type: UPDATE_ORDER_QUANTITY,
                _id: _id,
                purchaseQuantity: parseInt(donutInOrder.purchaseQuantity) + 1
            });
            idbPromise('order', 'put', {
                ...donutInOrder,
                purchaseQuantity: parseInt(donutInOrder.purchaseQuantity) + 1
            });
        } else {
            dispatch({
                type: ADD_DONUT_TO_ORDER,
                donut: { ...donut, purchaseQuantity: 1 }
            });
            idbPromise('order', 'put', { ...donut, purchaseQuantity: 1 });
        }
    }

    return (
        <>
            <div className="popup-window">
                <section className="popup-container">
                    <div className="popup-swirl"><img src={"/images/swirl-blue.svg"} alt="swirl" width="100%"></img></div>
                    <a className="close" href="#home">CLOSE</a>
                    <div className="popup-section">
                        <div className="donut-pic">
                            <img src={`/images/${donut.image}`}></img>
                        </div>
                        <div className="popup-info">
                            <h2>{donut.name}</h2>
                            <p className="popup-p">{donut.description}
                            </p>
                            </div>
                        </div>
                        <div className="popup-footer">
                            <div className="ingredients"> icon Contains:<span className='allergies'>Milk, Wheat, Egg</span></div>
                            <div className="popup-addtocart-box">
                                <span className="popup-addtocart">ADD TO CART</span>
                                <button className="popup-btn" onClick={addDonutToOrder}>icon</button>
                            </div>
                        </div>
                </section>
            </div>
        </>
    );
}

export default Popup;