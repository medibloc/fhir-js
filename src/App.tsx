import React, { useState, useEffect } from 'react';
import './App.css';
import { prettifiyObject as prettifyObject } from './utils/prettifier';
import { convertObjectUsingModel } from './utils/converter';

const sampleData = [
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
            CELLPHONENO: '01011113333',
            BIRTHDT: '19470821',
            GENDER: 'M',
            INHOSPITALYN: 'Y',
            VEHICLENO: null,
            ZIPCD: '03771',
            ZIPCDTXT:
              '서울 서대문구 북아현로 29 (북아현동, e편한세상신촌 3단지)',
            ADDRESS: '301동',
            ROADNAMECD: null,
            BUILDINGCD: null,
            BCODE: null,
            JIBUNADDR: null,
            JIBUNADDRENG: null,
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
      'name.use': {
        to: { parents: ['0', 'name', 0, 'use'], value: 'official' },
      },
      'name.text': {
        from: {
          parents: ['0', 'body', 0, 'PATIENTNM'],
        },
        to: {
          parents: ['0', 'name', 0, 'text'],
        },
      },
      'telecom.system': {
        to: { parents: ['0', 'telecom', 0, 'phone'], value: 'phone' },
      },
      'telecom.value': {
        from: { parents: ['0', 'body', 0, 'CELLPHONENO'] },
        to: {
          parents: ['0', 'telecom', 0, 'value'],
          valueReplace: {
            searchValue: '(...)(....)(....)',
            newValue: '$1-$2-$3',
          },
        },
      },
      'telecom.use': {
        to: { parents: ['0', 'telecom', 0, 'use'], value: 'mobile' },
      },
      gender: {
        from: { parents: ['0', 'body', 0, 'GENDER'] },
        to: {
          parents: ['0', 'gender'],
          valueTable: { M: 'male', F: 'female' },
        },
      },
      birthDate: {
        from: { parents: ['0', 'body', 0, 'BIRTHDT'] },
        to: {
          parents: ['0', 'birthDate'],
        },
      },
      'address.use': {
        to: {
          parents: ['0', 'address', 0, 'use'],
          value: 'home',
        },
      },
      'address.type': {
        to: {
          parents: ['0', 'address', 0, 'type'],
          value: 'postal',
        },
      },
      'address.text': {
        from: { parents: ['0', 'body', 0, 'ZIPCDTXT'] },

        to: {
          parents: ['0', 'address', 0, 'text'],
        },
      },
      'address.postalCode': {
        from: { parents: ['0', 'body', 0, 'ZIPCD'] },

        to: {
          parents: ['0', 'address', 0, 'postalCode'],
        },
      },
      'address.country': {
        to: {
          parents: ['0', 'address', 0, 'country'],
          value: 'KR',
        },
      },
    },
  },
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
          prettifyObject(
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
    setModelText(prettifyObject(JSON.parse(sampleModelText)));
    setSourceText(prettifyObject(JSON.parse(sampleSourceText)));
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
                    {prettifyObject(sampleModel)}
                  </textarea>
                </td>
                <td>
                  <textarea className="sampleMultipleText">
                    {prettifyObject(sampleSource)}
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
