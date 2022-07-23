// import React, { useState } from "react";

// import Main from "./components/main";
// import Book from "./components/book";
// import ThankYou from "./components/thankYou";
// import Navbar from "./components/navbar";

// export default _ => {
//     const [page, setPage] = useState(0);

//     return (
//         <div>
//             <Navbar setPage={setPage} />
//             {page === 0 ? <Main setPage={setPage} /> : null}
//             {page === 1 ? <Book setPage={setPage} /> : null}
//             {page === 2 ? <ThankYou /> : null}
//         </div>
//     );
// };


import React, { useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import {
    Row,
    Col,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
    Button
} from "reactstrap";
import DatePicker from "react-datepicker";
import axios from 'axios'
const BookTable = () => {

    const navigate = useNavigate();
    const [times] = useState([
        "9AM",
        "10AM",
        "11AM",
        "12PM",
        "1PM",
        "2PM",
        "3PM",
        "4PM",
        "5PM"
    ]);
    const [bookingDate, setBookingDate] = useState(new Date());
    const [locations] = useState(["Any Location", "Patio", "Inside", "Bar"]);
    const [thanks, setThanks] = useState('booking')
    const [msg, setMsg] = useState()
    const [selection, setSelection] = useState({
        table: {
            name: null,
            id: null
        },
        date: new Date(),
        time: null,
        location: "Any Location",
        size: 0
    });


    const getLocations = _ => {
        let newLocations = [];
        locations.forEach(loc => {
            newLocations.push(
                <DropdownItem
                    key={loc}
                    className="booking-dropdown-item"
                    onClick={_ => {
                        let newSel = {
                            ...selection,
                            table: {
                                ...selection.table
                            },
                            location: loc
                        };
                        setSelection(newSel);
                    }}
                >
                    {loc}
                </DropdownItem>
            );
        });
        return newLocations;
    };

    const getTimes = _ => {
        let newTimes = [];
        times.forEach(time => {
            newTimes.push(
                <DropdownItem
                    key={time}
                    className="booking-dropdown-item"
                    onClick={_ => {
                        let newSel = {
                            ...selection,
                            table: {
                                ...selection.table
                            },
                            time: time
                        };
                        setSelection(newSel);
                    }}
                >
                    {time}
                </DropdownItem>
            );
        });
        return newTimes;
    };

    const getSizes = _ => {
        let newSizes = [];

        for (let i = 1; i < 11; i++) {
            newSizes.push(
                <DropdownItem
                    key={i}
                    className="booking-dropdown-item"
                    onClick={e => {
                        let newSel = {
                            ...selection,
                            table: {
                                ...selection.table
                            },
                            size: i
                        };
                        setSelection(newSel);
                    }}
                >
                    {i}
                </DropdownItem>
            );
        }
        return newSizes;
    };

    const bookTable = () => {
        console.log(selection.location)
        console.log(selection.size)
        console.log(selection.time)
        console.log(bookingDate)
        if (selection.location && selection.size && selection.time && bookingDate) {
        axios.post("http://192.168.1.4:7000/api/v1/table/table-book", { date: bookingDate, location: selection.location, time: selection.time, person: selection.size, emailid:'aarifa@gmail.com' }).then((res) => {
            console.log(res.data)
            if (res.data.status) {
                setThanks('booked')
                setMsg(res.data)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Table Booked Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                setThanks('not available')
                setMsg(res.data)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Table Booking Failed!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select All Fields!',
        })
    }
    }
                        
    return (
        <div>
            <div>
                {thanks == 'booking' ? (
                    <div>
                        <Row>
                            <Col xs="12" sm="3" >

                                <UncontrolledDropdown >
                                    <DropdownToggle color="none" caret className="btn-menu animated fadeInUp scrollto tewst">
                                        <DatePicker className="form-control" selected={bookingDate} minDate={new Date()} onChange={(date) => setBookingDate(date)} />

                                        {/* <DatePicker
                                name="invoiceDate"
                                className="form-control form-control-sm"
                                type="text"
                                size="sm"
                                placeholder=""
                                selected={bookingDate}
                                minDate={new Date()}
                                // value={bookingDate}
                                onChange={(date) => setBookingDate(date)}
                                dateFormat="dd/MM/yyyy"
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                }}
                            /> */}

                                    </DropdownToggle>
                                    {/* <DropdownMenu end className="booking-dropdown-menu">
                        {getTimes()}
                    </DropdownMenu> */}
                                </UncontrolledDropdown>

                            </Col>

                            <Col xs="12" sm="3">
                                <UncontrolledDropdown>
                                    <DropdownToggle color="none" caret className="btn-menu animated fadeInUp scrollto tewst">
                                        {selection.location}
                                    </DropdownToggle>
                                    <DropdownMenu end className="booking-dropdown-menu">
                                        {getLocations()}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Col>

                            <Col xs="12" sm="3">
                                <UncontrolledDropdown>
                                    <DropdownToggle color="none" caret className="btn-menu animated fadeInUp scrollto tewst">
                                        {selection.time === null ? "Select a Time" : selection.time}
                                    </DropdownToggle>
                                    <DropdownMenu end className="booking-dropdown-menu">
                                        {getTimes()}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Col>

                            <Col xs="12" sm="3">

                                <UncontrolledDropdown>
                                    <DropdownToggle color="none" caret className="btn-menu animated fadeInUp scrollto tewst">
                                        {selection.size === 0
                                            ? "Select a Party Size"
                                            : selection.size.toString()}
                                    </DropdownToggle>
                                    <DropdownMenu end className="booking-dropdown-menu">
                                        {getSizes()}
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                            </Col>
                        </Row>


                        <div className="btns">
                            <p className="btn-bookTable animated fadeInUp scrollto" onClick={() => navigate('/home')}>Cancel</p>
                            <p className="btn-bookTable animated fadeInUp scrollto" onClick={() => bookTable()}>Book a Table</p>
                        </div>
                        {thanks == 'not available' ? (
                            <div>
                                <Row noGutters className="text-center">
                                    <Col>
                                        <p className="thanks-header">Sorry For Saying!</p>
                                        <i className="fas fa-pizza-slice thank-you-pizza">{msg.message} </i><br></br>
                                       
                                        <p className="thanks-subtext">
                                            Please try Again
                                        </p>

                                    </Col>

                                </Row>
                            </div>

                        ) : null}
                    </div>

                ) : (
                    <div>
                        <Row noGutters className="text-center">
                            <Col>
                            <div className='btn-1'>
                            <p className="btn-bookTable animated fadeInUp scrollto" onClick={() => navigate('/home')}>Okay</p>
                        </div>

                                <p className="thanks-header">Thank You!</p>
                                <i className="fas fa-pizza-slice thank-you-pizza">Your Table Booked</i><br></br>
                                <i className="fas fa-pizza-slice thank-you-pizza-2">Table Number: {msg.tableNumber} </i>
                                <p className="thanks-subtext">
                                    You should receive an email with the details of your reservation.
                                </p>

                            </Col>

                        </Row>
                    </div>
                )

                }
            </div>
        </div>
    )
}

export default BookTable
