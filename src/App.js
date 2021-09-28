import MaterialTable from "material-table"
import { useState, useEffect } from "react"
import {makeStyles} from '@material-ui/styles'
import {tableIcons} from './TableIcons'
import './App.scss'



const useStyles = makeStyles({
  myDeleteIcon:{
    color: "red"
  },
  myExportIcon:{
    color: "blue"
  },
  myAddIcon:{
    color: "darkblue"
  },
  myEditIcon:{
    color: "brown"
  }
})
export default function App() {
  const [tableData, setTableData] = useState()
  const columns = [
    {
      title: "Name",
      field: "name", 
      headerStyle:{fontWeight: "bold", fontSize: '1rem'},
      validate: rowData=>rowData.name === undefined || rowData.name === ""?"Required":true
    },
    {
      title: "Username",
      field: "username", 
      headerStyle:{fontWeight: "bold", fontSize: '1rem'},
      validate: rowData=>rowData.username === undefined || rowData.username === ""?"Required":true
    },
    {
      title: "Email",
      field: "email", 
      headerStyle:{fontWeight: "bold", fontSize: '1rem'},
      validate: rowData=>rowData.email === undefined || rowData.email === ""?"Required":true
    },
    {
      title: "Phone",
      field: "phone", 
      headerStyle:{fontWeight: "bold", fontSize: '1rem'},
      validate: rowData=>rowData.phone === undefined || rowData.phone === ""?"Required":true
    },
    {
      title: "Website",
      field: "website", 
      headerStyle:{fontWeight: "bold", fontSize: '1rem'},
      validate: rowData=>rowData.website === undefined || rowData.website === ""?"Required":true
    }
  ]

  const classes = useStyles()

  useEffect(() => {
    const fetch_data = async() =>{
      await fetch("https://jsonplaceholder.typicode.com/users")
          .then((res)=>res.json())
          .then((json)=>setTableData(json))
    }
    fetch_data()
  },[])


  return (
    <div className="table">
      <div className="table-container">
        <div className="table-heading">
          <span>React Material Table</span>
        </div>
        <div>
          <MaterialTable
            style={{
              width: "80vw"
            }}
            icons={{
              ...tableIcons,
              Delete: ()=><tableIcons.Delete className={classes.myDeleteIcon}/>,
              Export: ()=><tableIcons.Export className={classes.myExportIcon}/>,
              Add: ()=><tableIcons.Add className={classes.myAddIcon}/>,
              Edit: ()=><tableIcons.Edit className={classes.myEditIcon}/>,
            }}
            title="Users Data"
            columns={columns}
            data={tableData}
            editable={{
              onRowAdd:(newRow)=>new Promise((resolve, reject)=>{
                fetch("https://jsonplaceholder.typicode.com/users",{
                  method: "POST",
                  body: JSON.stringify({
                    ...newRow
                  }),
                  headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                  }
                })
                .then((response)=>response.json())
                .then((json)=>{
                  setTableData([
                    ...tableData,
                    json
                  ])
                  resolve()
                })
              }),
              onRowUpdate:(newRow, oldRow)=>new Promise((resolve, reject)=>{
                fetch(`https://jsonplaceholder.typicode.com/users/${newRow.id}`,{
                method: "PUT",
                body: JSON.stringify(newRow),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                }
                })
                .then((response)=>response.json())
                .then((json)=>{
                  const dataCopy = [...tableData]
                  dataCopy[oldRow.tableData.id] = json
                  setTableData(dataCopy)
                  resolve()
                })
              }),
              onRowDelete:(selectedRow)=>new Promise((resolve, reject)=>{
                fetch(`https://jsonplaceholder.typicode.com/users/${selectedRow.id}`,{
                method: "DELETE"
                })
                .then((nothing)=>{
                  const updatedData = tableData.filter(ele=>ele!==selectedRow)
                  setTableData(updatedData)
                  resolve()
                })
              })
            }}
            options={{
              pageSize: 5,
              pageSizeOptions:[5, 10],
              exportButton:true,
              exportAllData: true,
              exportFileName: "UsersTableData",
              showFirstLastPageButtons: false,
              addRowPosition: "first",
              actionsColumnIndex: -1,
              searchFieldVariant: 'standard'
            }}
          />
        </div>
      </div>
    </div>
  )
}

