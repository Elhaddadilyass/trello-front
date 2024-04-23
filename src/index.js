import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import "./index.css";

const rootelement = document.getElementById('root');

const Header = () => (
    <header className="masthead">
        <div className="boards-menu">
            <button className="boards-btn btn"><i className="fab fa-trello boards-btn-icon"></i>Boards</button>
            <div className="board-search">
                <input type="search" className="board-search-input" aria-label="Board Search"/>
                <i className="fas fa-search search-icon" aria-hidden="true"></i>
            </div>
        </div>
        <div className="logo">
            <h1><i className="fab fa-trello logo-icon" aria-hidden="true"></i>Trello</h1>
        </div>
        <div className="user-settings">
            <button className="user-settings-btn btn" aria-label="Create">
                <i className="fas fa-plus" aria-hidden="true"></i>
            </button>
            <button className="user-settings-btn btn" aria-label="Information">
                <i className="fas fa-info-circle" aria-hidden="true"></i>
            </button>
            <button className="user-settings-btn btn" aria-label="Notifications">
                <i className="fas fa-bell" aria-hidden="true"></i>
            </button>
            <button className="user-settings-btn btn" aria-label="User Settings">
                <i className="fas fa-user-circle" aria-hidden="true"></i>
            </button>
        </div>
    </header>
);

const Section = () => (
    <section className="board-info-bar">
        {/* Your section content */}
    </section>
);


const ListsContainer = () => {
    const [lists, setLists] = useState([
        {
            id: 'list1',
            title: 'Tasks to Do',
            items: [
                {id: 'task1', content: 'Complete mock-up for client website'},
                {id: 'task2', content: 'Email mock-up to client for feedback'},
                // Other tasks
            ]
        },
        {
            id: 'list2',
            title: 'mal3oba',
            items: [
                {id: 'task3', content: 'nakoulha lek'},
                {id: 'task4', content: 'sir fsbate'},
                // Other tasks
            ]
        },
        // Other lists
    ]);
    const [newListName, setNewListName] = useState('');
    const [showAddListInput, setShowAddListInput] = useState(false);

    const [ ,setShowAddListButton] = useState(true);
    const addList = () => {
        if (newListName.trim() !== '') {
            const newList = {
                id: `list${lists.length + 1}`,
                title: newListName,
                items: []
            };
            setLists([...lists, newList]);
            setNewListName(''); // Reset the input field
            setShowAddListInput(false); // Hide the input field after adding a new list
        }
    };
    const handleInputChange = (e) => {
        setNewListName(e.target.value);
    };
    const deleteList = (listId) => {
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
    };
    const deleteCard = (listId, cardId) => {
        const updatedLists = lists.map(list => {
            if (list.id === listId) {
                const updatedItems = list.items.filter(item => item.id !== cardId);
                return {...list, items: updatedItems};
            }
            return list;
        });
        setLists(updatedLists);
    };
    const onDragEnd = (result) => {
        const {source, destination} = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        // Dropped in the same position
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Reorder the tasks within the same list
        const sourceList = lists.find(list => list.id === source.droppableId);
        const destinationList = lists.find(list => list.id === destination.droppableId);

        if (source.droppableId === destination.droppableId) {
            const reorderedItems = Array.from(sourceList.items);
            const [removed] = reorderedItems.splice(source.index, 1);
            reorderedItems.splice(destination.index, 0, removed);

            setLists(prevLists => {
                return prevLists.map(list => {
                    if (list.id === source.droppableId) {
                        return {...list, items: reorderedItems};
                    }
                    return list;
                });
            });
        } else {
            // Move the task to a different list
            const sourceItems = Array.from(sourceList.items);
            const destinationItems = Array.from(destinationList.items);
            const [removed] = sourceItems.splice(source.index, 1);
            destinationItems.splice(destination.index, 0, removed);

            setLists(prevLists => {
                const updatedLists = prevLists.map(list => {
                    if (list.id === source.droppableId) {
                        return {...list, items: sourceItems};
                    }
                    if (list.id === destination.droppableId) {
                        return {...list, items: destinationItems};
                    }
                    return list;
                });

                return updatedLists;
            });
        }

    };

    const addCard = (listId, taskContent) => {
        const newList = lists.map(list => {
            if (list.id === listId) {
                const newTask = {
                    id: `task${Math.floor(Math.random() * 10000)}`,
                    content: taskContent
                };
                return {...list, items: [...list.items, newTask]};
            }
            return list;
        });
        setLists(newList);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="lists-container">
                {lists.map((list, index) => (
                    <div key={list.id} className="list">
                        <div className="list-header">
                            <h3 className="list-title">{list.title}</h3>
                            <button className="delete-list-btn" onClick={() => deleteList(list.id)}>Delete</button>
                        </div>
                        <Droppable droppableId={list.id}>
                            {(provided) => (
                                <ul className="list-items" {...provided.droppableProps} ref={provided.innerRef}>
                                    {list.items.map((item, idx) => (
                                        <Draggable key={item.id} draggableId={item.id} index={idx}>
                                            {(provided) => (
                                                <li
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {item.content}
                                                    <button className="delete-card-btn" onClick={() => deleteCard(list.id, item.id)}>X</button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                        <AddCardForm listId={list.id} addCard={addCard} />
                    </div>
                ))}
                {showAddListInput ? (
                    <div className="add-list-input">
                        <input
                            type="text"
                            value={newListName}
                            onChange={handleInputChange}
                            placeholder="Enter list name"
                        />
                        <button onClick={addList}>Add</button>
                    </div>
                ) : (
                    <button className="add-list-btn btn" onClick={() => setShowAddListInput(true)}>Add a list</button>
                )}
            </div>
        </DragDropContext>
    );

};

const AddCardForm = ({listId, addCard}) => {
    const [showModal, setShowModal] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');

    const handleChange = (e) => {
        setNewTaskContent(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTaskContent.trim() !== '') {
            addCard(listId, newTaskContent);
            setNewTaskContent('');
            setShowModal(false);
        }
    };

    return (
        <div>
            <button className="add-card-btn btn" onClick={() => setShowModal(true)}>
                Add a card
            </button>
            {showModal && (
                <div className="modal">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={newTaskContent}
                            onChange={handleChange}
                            placeholder="Enter Card name"
                            required
                        />
                        <button type="submit" className="add-card-btn btn">
                            Add
                        </button>
                        <button onClick={() => setShowModal(false)} className="add-card-btn btn cancel-btn">
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
const App = () => (

    <div>
        <Header/>
        <Section/>
        <ListsContainer/>
    </div>
);

ReactDOM.render(<App/>, rootelement);
