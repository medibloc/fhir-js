import React, { useState, useEffect } from 'react';
import './App.css';
import { prettifiyObject } from './utils/prettifier';
import { convertObjectUsingModel } from './utils/converter';

const sampleData = [
  {
    name: 'Test Data 1',
    source: {
      a: 'aaa',
      b: 'bbb',
    },
    model: {
      1: {
        from: {
          parents: ['a'],
        },
        to: {
          parents: ['b', 1, 'c'],
        },
      },
    },
  },
  {
    name: 'Test Data 2',
    source: {
      0: {
        name: 'eunsol',
        tel: '010-9811-6424',
        job: 'want to be freeman?',
      },
      1: {
        house: [
          {
            main: 'seoul',
          },
          {
            sub: 'pusan',
          },
        ],
      },
    },
    model: {
      name: {
        from: { parents: ['0', 'name'] },
        to: { parents: ['1'] },
      },
      tel: {
        from: { parents: ['0', 'tel'] },
        // eslint-disable-next-line
        to: { parents: ['${name}', 'tel'] },
      },
      job: {
        from: { parents: ['0', 'job'] },
        // eslint-disable-next-line
        to: { parents: ['${name}', 'job'] },
      },
      houseMain: {
        from: { parents: ['1', 'house', 0, 'main'] },
        // eslint-disable-next-line
        to: { parents: ['${name}', 0] },
      },
      houseSub: {
        from: { parents: ['1', 'house', 1, 'sub'] },
        // eslint-disable-next-line
        to: { parents: ['${name}', 1] },
      },
    },
  },
  {
    name: 'patient resource sample',
    source: {
      0: {
        elapsedTime: '28',
        status: 'OK',
        errors: null,
        message: null,
        timestamp: '2019-10-31 20:33:06',
        bodyType: 'ARRAY',
        body: [
          {
            PATIENTNM: '김*희',
            // String(환자명) -> Patient.name
            CELLPHONENO: '01011113333',
            // String(휴대전화 번호) -> Patient.telecom
            BIRTHDT: '19470821',
            // String(생년월일; yyyyMMdd) -> Patient.birthDate
            GENDER: 'M',
            // String(성별; M,F) -> Patient.gender
            INHOSPITALYN: 'Y',
            // St ring(병원안 여부; Y,N) -> 제외
            VEHICLENO: null,
            // String(차량번호) -> 제외
            ZIPCD: '03771',
            // String(우편번호) -> Patient.address[0,1,2]
            ZIPCDTXT:
              '서울 서대문구 북아현로 29 (북아현동, e편한세상신촌 3단지)',
            // String(우편번호 주소) -> Patient.address[0]
            ADDRESS: '301동',
            // String(주소) -> Patient.address[0]
            ROADNAMECD: null,
            // String(도로명코드) -> Patient.address[1]
            BUILDINGCD: null,
            // String(건물번호) -> Patient.address[1]
            BCODE: null,
            // String(법정동코드) -> Patient.address[2]
            JIBUNADDR: null,
            // String(지번주소) -> Patient.address[2]
            JIBUNADDRENG: null,
            // String(지번주소영문) -> Patient.address[2]
          },
        ],
      },
    },
    model: {
      resourceType: {
        to: {
          parents: ['0', 'resourceType'],
          value: 'patient',
        },
      },
      nameText: {
        from: {
          parents: ['0', 'body', 0, 'PATIENTNM'],
        },
        to: {
          parents: ['0', 'name', 0, 'text'],
        },
      },
    },
  },
];

function App() {
  const [modelText, setModelText] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');

  // function handleTextChange(event) {}

  function handleModelChange(event: any) {
    setModelText(event.target.value);
  }

  function handleSourceChange(event: any) {
    setSourceText(event.target.value);
  }

  useEffect(
    function () {
      try {
        setTargetText(
          prettifiyObject(
            convertObjectUsingModel({
              source: JSON.parse(sourceText),
              model: JSON.parse(modelText),
            })
          )
        );
      } catch (e) {}
    },
    [modelText, sourceText]
  );

  function copyText(sampleModelText: any, sampleSourceText: any) {
    setModelText(sampleModelText);
    setSourceText(sampleSourceText);
  }

  return (
    <div>
      <table>
        <tr>
          <th>Model</th>
          <th>Source</th>
          <th>Target</th>
        </tr>
        <tr>
          <td>
            <textarea
              className="multipleText"
              onChange={handleModelChange}
              value={modelText}
            >
              text area1
            </textarea>
          </td>
          <td>
            <textarea
              className="multipleText"
              onChange={handleSourceChange}
              value={sourceText}
            >
              text area2
            </textarea>
          </td>
          <td>
            <textarea className="multipleText" value={targetText}>
              text area3
            </textarea>
          </td>
        </tr>
        {sampleData.map(
          ({ name: sampleName, model: sampleModel, source: sampleSource }) => (
            <>
              <tr>
                <button
                  onClick={() =>
                    copyText(
                      JSON.stringify(sampleModel),
                      JSON.stringify(sampleSource)
                    )
                  }
                >
                  {sampleName}
                </button>
              </tr>
              <tr>
                <td>
                  <textarea className="sampleMultipleText">
                    {prettifiyObject(sampleModel)}
                  </textarea>
                </td>
                <td>
                  <textarea className="sampleMultipleText">
                    {prettifiyObject(sampleSource)}
                  </textarea>
                </td>
                <td>
                  <textarea className="sampleMultipleText">text area3</textarea>
                </td>
              </tr>
            </>
          )
        )}
      </table>
    </div>
  );
}

export default App;
