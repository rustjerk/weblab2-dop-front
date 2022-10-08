import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AppContainer from "components/AppContainer";
import AppBody from "components/AppBody";
import NavBar from "components/NavBar";

import { fetchStudyGroups } from "api";

import "./index.scoped.css";

function StudyGroups() {
  const [data, setData] = useState(null);

  useEffect(() => { 
    (async () => {
      let data = await fetchStudyGroups();
      setData(data);
      data.sort((a, b) => {
        if (a.name.length > b.name.length) return 1;
        if (a.name.length < b.name.length) return -1;
        return a.name.localeCompare(b.name);
      });
    })();
  }, []);

  return (
    <AppContainer>
      <NavBar/>
      <AppBody>
        <h1>Учебные группы</h1>
        {data && <div class="groups">
          {data.map((entry, i) => (
            <Link to={"/study-group/" + entry.id} key={i}>
              {entry.name}
            </Link>
          ))}
        </div>}
      </AppBody>
    </AppContainer>
  );
}

export default StudyGroups;
