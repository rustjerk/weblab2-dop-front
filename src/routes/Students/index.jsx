import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { DebounceInput } from 'react-debounce-input';

import AppContainer from "components/AppContainer";
import AppBody from "components/AppBody";
import NavBar from "components/NavBar";
import Pagination from "components/Pagination";

import { fetchStudents } from "api";

import "./index.scoped.css";

function Students() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const [idQuery, setIdQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");

  useEffect(() => { 
    (async () => {
      let data = await fetchStudents(currentPage - 1, { idQuery, nameQuery, groupQuery });
      setData(data);
      setCurrentPage(data.currentPage + 1);
      setPageCount(data.pageCount);
    })();
  }, [currentPage, idQuery, nameQuery, groupQuery]);
  
  const onPageChange = useCallback(page => {
    if (currentPage === page) return;
    setCurrentPage(page);
    if (tableRef) tableRef.current.scrollIntoView();
  }, [currentPage]);
 
  return (
    <AppContainer>
      <NavBar/>
      <AppBody >
        <h1>Студенты ФПИиКТ</h1>
        <div ref={tableRef} className="container">
          <label className="input first-col">
            <BiSearch/>
            <DebounceInput debounceTimeout={200} value={idQuery} 
              onChange={e => setIdQuery(e.target.value)} placeholder="Номер" />
          </label>
          <label className="input">
            <BiSearch/>
            <DebounceInput debounceTimeout={200} value={nameQuery}
              onChange={e => setNameQuery(e.target.value)} placeholder="ФИО" />
          </label>
          <label className="input last-col">
            <BiSearch/>
            <DebounceInput debounceTimeout={200} value={groupQuery}
              onChange={e => setGroupQuery(e.target.value)} placeholder="Группа" />
          </label>
          
          <div className="table-shadow"></div>
          
          <div className="cell header first-row first-col">Номер</div>
          <div className="cell header first-row">ФИО</div>
          <div className="cell header first-row last-col">Группа</div>

          {data && data.data.map(({ id, fullName, studyGroupName }, i) => {
            let classes = "cell" + (i === data.data.length - 1 ? " last-row" : "");
            return [
              <div key={i} className="row" onClick={() => navigate("/student/" + id)}>
                <div className={classes + " first-col"}>{id}</div>
                <div className={classes}>{fullName}</div>
                <div className={classes + " last-col"}>{studyGroupName}</div>
              </div>
            ];
          })}
        </div>
        <Pagination currentPage={currentPage} pageCount={pageCount}
          onPageChange={onPageChange} />
      </AppBody>
    </AppContainer>
  );
}

export default Students;
