import axios from 'axios'
import Constants from 'app/utils/Constants'
import { useState, useEffect } from 'react'
import Store from 'app/utils/Store'
let logged_user = Store.USER
import CommonDialog from "app/components/dialog/CommonDialog";
import CommonForm from "app/components/form/CommonForm";
import clsx from 'clsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardList from './BoardList'
import './home.css'
export default function Home() {
    const [kanban, setKanban] = useState([])
    const [openCreateKanban, setOpenCreateKanban] = useState(false)
    const [usersOptions, setUsersOptions] = useState([])
    const createNewKanban = (values) => {
        values.user_cad = logged_user.id_user
        axios.post(Constants.APIEndpoints.KANBAN + "/createColumn", values).then(res => {
            getData();

            setOpenCreateKanban(false)
        })
    }


    useEffect(() => {
        getData();

        axios.get(Constants.APIEndpoints.USER + "/getAllUsers").then(users => {
            let users_ = users.data[0].map(u => ({ value: u.id_user, label: u.name }))
            setUsersOptions(users_)
        })

    }, [])


    const getData = () => {
        axios.post(Constants.APIEndpoints.KANBAN + "/getKanban", { user: logged_user.id_user }).then(res => {
            console.log('ress', res.data)
            setKanban(res.data[0])
        })
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result

        const columnOrigin = source.droppableId.replace('column', '')
        const columnDestination = destination.droppableId.replace('column', '')
        const cardId = draggableId.replace('card', '')

        const data = {
            fk_id_column_destination: columnDestination,
            fk_id_card: cardId
        }
        axios.post(Constants.APIEndpoints.KANBAN + "/moveCard", data).then(res => {
            getData()
        })

    }

    return (
        <div>
            <button className='buttonCreateNewColumn' onClick={() => setOpenCreateKanban(true)}>CRIAR NOVA COLUNA</button>

            <CommonDialog
                open={openCreateKanban}
                onClose={() => setOpenCreateKanban(false)}
                title="Criar Nova Coluna"
                width="xs"
            >
                <CommonForm
                    fields={[
                        {
                            col: 12,
                            name: 'name',
                            label: 'Nome',
                            type: 'text',
                            required: true
                        }
                    ]}
                    onSubmit={createNewKanban}

                />
            </CommonDialog>


            <div className={clsx('flex flex-1 overflow-x-auto overflow-y-hidden')}>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list" type="list" direction="horizontal">
                        {(provided) => (
                            <div ref={provided.innerRef} className="flex container py-16 md:py-24 px-8 md:px-12">
                                {kanban.map((list, index) => (
                                    <BoardList getData = {getData} key={list.id_kanban_column} list={list} index={index} usersOptions={usersOptions} />
                                ))}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}