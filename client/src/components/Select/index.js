import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const Select = ({ setTimeTableData,setSelectedClass, setSelectedGrade, selectedClass, selectedGrade, setCurrentDateTime,currentDateTime}) => {

  const [cancelToken, setCancelToken] = useState(null); // 요청 취소 토큰
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedGrade = selectedValue.slice(0, 1);
    const selectedClass = selectedValue.slice(1, 2);
    setSelectedGrade(selectedGrade);
    setSelectedClass(selectedClass);
  };

  const onMondayClick = () => {
    
      // 선택 값이 변경될 때마다 로컬 스토리지에 저장
      localStorage.setItem('selectedGrade', selectedGrade);
      localStorage.setItem('selectedClass', selectedClass);  
      // 이전 요청 취소
      if (cancelToken) {
        cancelToken.cancel('Previous request canceled');
      }
  
      // 요청 취소 토큰 생성
      const source = axios.CancelToken.source();
      setCancelToken(source);
  
      // 선택 값이 존재할 경우에만 요청 보냄
      if (selectedGrade && selectedClass) {
        axios.post('http://localhost:8080/viewtimetable', { grade: selectedGrade, class: selectedClass }, { cancelToken: source.token })
          .then(response => {
            setTimeTableData(response.data);
          })
          .catch(error => {
            if (axios.isCancel(error)) {
              console.log('Request canceled', error.message);
            } else {
              console.log(error);
            }
          });
      }
  }


  return (
    <>
      <header>
        <div>
          <div className="maintext">
            {selectedGrade}학년 {selectedClass}반
          </div>
        </div>
      </header>
      <nav>
        <div className='item1'>
          {currentDateTime}
        </div>
        <div id='dis' className='item1'>B</div>
        <select className='item1' onChange={handleSelectChange} value={selectedGrade + selectedClass}>
          <option value="11">1-1</option>
          <option value="12">1-2</option>
          <option value="13">1-3</option>
          <option value="14">1-4</option>
          <option value="15">1-5</option>
          <option value="21">2-1</option>
          <option value="22">2-2</option>
          <option value="23">2-3</option>
          <option value="24">2-4</option>
          <option value="25">2-5</option>
          <option value="31">3-1</option>
          <option value="32">3-2</option>
          <option value="33">3-3</option>
          <option value="34">3-4</option>
          <option value="35">3-5</option>
        </select>
      </nav>
      <nav>
        <div className='item2' onClick={onMondayClick}>월</div>
        <div className='item2'>화</div>
        <div className='item2'>수</div>
        <div className='item2'>목</div>
        <div className='item2'>금</div>
      </nav>
      <p>Selected grade: {selectedGrade}</p>
      <p>Selected class: {selectedClass}</p>
      <footer>
        <div></div>
      </footer>
    </>
  );
};

export default Select;
