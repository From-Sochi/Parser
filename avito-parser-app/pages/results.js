import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { withAuth } from '../components/withAuth'; // ← ИМПОРТ HOC

function Results() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const savedData = localStorage.getItem('parsedData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');
        XLSX.writeFile(workbook, 'users_data.xlsx');
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <h1>Results</h1>
            <button onClick={exportToExcel}>Export to Excel</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.city}</td>
                            <td>{item.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default withAuth(Results); // ← ОБЕРТКА В HOC