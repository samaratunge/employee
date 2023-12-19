import { useState } from "react";
import { BrowserRouter, Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";

const AddEmployee = () => {
    const [empID, setEmpID] = useState('');
    const [empName, setEmpName] = useState('');
    const [empAddress, setEmpAddress] = useState('');
    const [search, setSearch] = useState('');
    const [result, setResult] = useState('');
    const [company, setCompany] = useState('');
    const navigate = useNavigate();

    const ValidateAddress = async (e) => {
        try {
            setEmpAddress(e.target.value);
            //Wait until get the response
            const response = await fetch(`https://api.addressfinder.io/api/nz/address/autocomplete/?q=${empAddress}&format=json&key=LHPFCGXMRTUEVB3W84QN`);
            if (response.ok) {
                // destructing the json object including json array starting with completions
                let { completions } = await response.json();
                // extract the address only assigned to json key starts "a"                            
                setSearch(completions.map((item) => item.a)[0]);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const SelectAddress = (event) => {
        event.preventDefault();
        setResult(search);
    }
    //Employee form submission and pass the resulted data
    const employeeOnSubmit = (event) => {
        event.preventDefault();
        navigate("/EmployeeResult", { state: { empID, empName, result, company } });
    };

    return (
        <div>
            <h2>Enter Employee Details</h2>
            <form onSubmit={employeeOnSubmit}>
                Employee ID        :  <input type="text" value={empID} onChange={(e) => setEmpID(e.target.value)} /> <br />
                Employee Name      :<input type="text" value={empName} onChange={(e) => setEmpName(e.target.value)} /> <br />
                Search Address     :<input type="text" value={empAddress} onChange={ValidateAddress} placeholder="Search Address" /><br />
                <label>{search}</label> <button onClick={SelectAddress}> Select Address </button><br />
                Employee Address   : <input type="text" value={result} disabled /> <br />
                Company            : <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} /> <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
// Navigated to display employee result page
const EmployeeResult = () => {
    const location = useLocation();
    return (<div>
        Employee ID      : {location.state.empID} <br />
        Employee Name    : {location.state.empName} <br />
        Employee Address : {location.state.result} <br />
        Company          : {location.state.company} <br />
    </div>);
}
//Perform Routing logic
const EmployeeManipulate = () => {
    return (
        <div>
            <BrowserRouter>
                <div><ul> <li> <Link to="/">Home</Link></li></ul><hr />
                    <Routes>
                        <Route path="/" Component={AddEmployee}></Route>
                        <Route path="/EmployeeResult" Component={EmployeeResult}></Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}
export default EmployeeManipulate;