import '../App.css'
import {TextField,DatePicker,DefaultButton,SelectionMode ,DetailsList, IColumn, Pivot, PivotItem,ChoiceGroup,IChoiceGroupOption,PrimaryButton,IIconProps, ActionButton,Dialog,DialogFooter,DialogType} from '@fluentui/react'
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import React, { useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

interface TaskList {
    name : string,
    description : string,
    startDate?: Date|null|string,
    endDate?:Date|null|string,
}

const myOptions : IChoiceGroupOption[] =[
    { key: 'Yes', text: 'Yes' },
    { key: 'No', text: 'No' }
]

const Form1 : React.FC = ()=> {
    const [todoList,setTodoList] = useState<TaskList[]>([]);
    const [Completedtodo,setCompletedTodo] = useState<TaskList[]>([]);
    const [taskToConfirm, setTaskToConfirm] = useState<number | null>(null);
    const [task,setTask] = useState('');
    const [des,setDes] = useState('');
    const [pOpen,setPOpen] = useState(false);
    const [showEdit,setShowEdit] = useState(true);
    const [showWarn,setShowWarn] = useState(true);
    const [startD,setStartD] = useState<Date | undefined>(undefined)
    const [endD,setEndD] = useState<Date | undefined>(undefined)
    const [editInd,setEditInd] = useState<number|null>(null)
    const dateIcon : IIconProps = {iconName: 'EventDate'}
    const [show, { toggle: setShow }] = useBoolean(false);

    const handleInput = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement> , newValue?: string) =>{
        setTask(newValue|| '')
    }
     
    const handleInput2 = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement> , newValue?: string) =>{
        setDes(newValue|| '')
    }

    const handleInput3 = (date: Date | null | undefined)=>{
        setStartD(date || undefined)
        console.log(startD)
    }

    const handleInput4 = (date: Date | null | undefined)=>{
        setEndD(date || undefined)
    }

    const handleDel = (ind : number)=>{
        console.log(todoList)       
        let newTaskArray = [...todoList]
        newTaskArray.splice(ind,1)
        setTodoList([...newTaskArray])
        console.log(todoList)       
    }

    const handleEdit = (ind:number)=>{
        setShowEdit(!showEdit);      

        const todo = todoList[ind];
        setTask(todo.name);
        setDes(todo.description);
        setStartD(todo.startDate ? new Date(todo.startDate):undefined)
        setEndD(todo.endDate? new Date(todo.endDate):undefined)
        setEditInd(ind);
    }

    const addToList = () =>{
        if (task!='') {
        const sd = startD?.toDateString();
        const ed = endD?.toDateString();
        const newTask: TaskList = { name: task, description: des, startDate: sd , endDate: ed };
        setTodoList([...todoList, newTask]);
        setTask(''); setDes(''); setStartD(undefined); setEndD(undefined);
        }
        else{
            alert("Enter a Task Name")
        }
    }

    const UpdateList = ()=>{
      if (editInd!=null && task !='') {      
        const updateArr = [...todoList];
        const sd = startD?.toDateString();
        const ed = endD?.toDateString();
        updateArr[editInd] = {name:task,description:des,startDate:sd,endDate:ed}
        setTodoList(updateArr)
        setTask(''); setDes(''); setStartD(undefined); setEndD(undefined)
        setEditO();
      }
      else
        alert("Enter a Task Name")
    }

    const confirmCompletion = ()=>{
        if(taskToConfirm !==null){
           const cTask = todoList[taskToConfirm];
           setCompletedTodo([...Completedtodo,cTask]);
           setTaskToConfirm(null)
        }

    }
    const showYN =(_item?: any,_index?:number,_column?: IColumn): JSX.Element | undefined =>{    
       const handleChoiceYes = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption): void =>{
            if (option?.key==='Yes' && _index !== undefined){
                setTaskToConfirm(_index)
                  setWarnO();
            }
        }
        return (
           <ChoiceGroup defaultSelectedKey={"No"} options={myOptions} onChange={handleChoiceYes}/>
        );
    }

    const showDE =(_item?: any,index?:number ,_column?: IColumn): JSX.Element | undefined =>{
        return(
            <div className="button-container">
                <DefaultButton onClick={()=>{if(index !== undefined){handleDel(index)}}}>Delete</DefaultButton>&nbsp;&nbsp;
                <PrimaryButton onClick={()=>{if(index !== undefined){handleEdit(index);setEditO()}}}>Edit</PrimaryButton>
            </div>
        );
    }
  
    const changePO = ()=>{
        setPOpen(!pOpen)
    }

    const setEditO = ()=>{
        setShowEdit(!showEdit)
    }

    const setWarnO = ()=>{
        setShowWarn(!showWarn)
    }

    const myColumns : IColumn[] = [
        {key: 'Column1', name: 'Task Name' ,fieldName : 'name' ,minWidth : 100 ,maxWidth :150 },
        {key: 'Column2', name: 'Task Description' ,fieldName : 'description' ,minWidth : 200 , maxWidth: 400 },
        {key: 'Column3', name: 'Start Date' ,fieldName : 'startDate' ,minWidth : 100 ,maxWidth :150 },
        {key: 'Column4', name: 'End Date' ,fieldName : 'endDate' ,minWidth : 100 ,maxWidth :150 },
        {key:'Column5', name: 'Task Completed', minWidth: 150,maxWidth: 250, onRender: showYN },
        {key:'Column6', name:'Manipulate' , minWidth: 200 , onRender: showDE}
    ]
    
    const myColumns2 : IColumn[] = [
        {key: 'Column1', name: 'Task Name' ,fieldName : 'name' ,minWidth : 100 ,maxWidth :150 },
        {key: 'Column2', name: 'Task Description' ,fieldName : 'description' ,minWidth : 200 , maxWidth: 400 },
        {key: 'Column3', name: 'Start Date' ,fieldName : 'startDate' ,minWidth : 100 ,maxWidth :150 },
        {key: 'Column4', name: 'End Date' ,fieldName : 'endDate' ,minWidth : 100 ,maxWidth :150 },
    ]

    return (<>
        <div className="parent-container" >
            <Pivot>
                <PivotItem headerText='Add Tasks' className='Add-Pivot'>
                 <div className="text-fields">
                   <TextField label="Name" placeholder='Enter Task Name' value={task} onChange={handleInput}/>
                   <TextField label="Description" multiline rows={3} resizable={false} value={des} onChange={handleInput2} placeholder='Enter Task Description' />
                </div>
                <div className="addition-detail-block">
                    <ActionButton iconProps={dateIcon} onClick={setShow} text={show ?'Hide Date Options' : 'Show Date Ootions'}></ActionButton>
                    {show && (
                        <div className="date-fields">
                        <DatePicker label="Start Date"  placeholder="Enter Start Date" onSelectDate={handleInput3} value={startD}/>
                        <DatePicker label="End Date"  placeholder="Enter End Date" onSelectDate={handleInput4} value={endD}/>
                       </div>
                    )} 
                    
                </div>

                 <div className="button-container">      
                   <PrimaryButton onClick={addToList}>Add</PrimaryButton>
                   <DefaultButton>Cancel</DefaultButton>
                 </div>

            </PivotItem>
            <PivotItem headerText='View Tasks'>
                   <DetailsList items={todoList} columns={myColumns} selectionMode={SelectionMode.none}/>

                    <Dialog hidden={showEdit} onDismiss={setEditO} dialogContentProps={{
                       type : DialogType.largeHeader,
                       title : 'Edit Task',
                      }} modalProps={{isBlocking:false, styles: { main: { width: '100vw', maxWidth: '100vw' } }}}>
                        
                         <div className="text-fields">
                            <TextField label="Name" placeholder='Enter Task Name' value={task} onChange={handleInput}/>
                            <TextField label="Description" multiline rows={3} resizable={false} value={des} onChange={handleInput2} placeholder='Enter Task Description' />
                         </div>
                         <div className="addition-detail-block">
                            <ActionButton iconProps={dateIcon} onClick={setShow} text={show ?'Hide Date Options' : 'Show Date Ootions'}></ActionButton>
                            {show && (
                              <div className="date-fields">
                               <DatePicker label="Start Date"  placeholder="Enter Start Date" onSelectDate={handleInput3} value={startD}/>
                               <DatePicker label="End Date"  placeholder="Enter End Date" onSelectDate={handleInput4} value={endD}/>
                              </div>
                         )} 
                        </div>

                 <div className="button-container">      
                   <PrimaryButton onClick={UpdateList}>Update</PrimaryButton>
                   <DefaultButton onClick={setEditO}>Cancel</DefaultButton>
                 </div>

                   </Dialog>

                   <Dialog hidden={showWarn} onDismiss={setWarnO} dialogContentProps={{
                      type : DialogType.normal,
                      title : 'Confirm Task Complition',
                      closeButtonAriaLabel: 'Close',
                      subText: 'Do you want to mark task as Completed?',
                   }}>
                    <DialogFooter>
                        <PrimaryButton onClick={()=>{confirmCompletion();setWarnO();}} text="Confirm" />
                        <DefaultButton onClick={setWarnO} text="Cancel" />
                    </DialogFooter>
                   </Dialog>
                   
                    <PrimaryButton onClick={changePO}>Show Completed</PrimaryButton>
                        
                    <Panel type={PanelType.medium} isLightDismiss isOpen={pOpen} onDismiss={changePO}  closeButtonAriaLabel="Band Kro Hath jod ke" headerText="Completed Tasks">
                        <DetailsList items={Completedtodo} columns={myColumns2} selectionMode={SelectionMode.none}/>
                    </Panel>
            </PivotItem>
        </Pivot>
    </div >
    </>);
}

export default Form1
  
{/* <div className="tasks-container">
{
    todoList.map((item,ind)=>{
        return(
            <>
               <div key={ind}>
                  <h1>{item.name}</h1>
                  <p>{item.description}</p>
               </div>
            </>
        )
    })
}
</div> */}

   {/* //Additional details options  */}
                     {/* <Checkbox label="Start Date"  />
                    <DatePicker
                        // componentRef={datePickerRef}
                        label="Start date"
                        allowTextInput
                        ariaLabel="Select a date"
                        // value={value}
                        // onSelectDate={setValue as (date: Date | null | undefined) => void}
                        // className={styles.control}
                        // DatePicker uses English strings by default. For localized apps, you must override this prop.
                        // strings={defaultDatePickerStrings}
                    />
                    <DefaultButton aria-label="Clear the date input" text="Clear" /> */}