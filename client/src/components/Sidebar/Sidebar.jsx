/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCirclePlus,
    faRectangleList,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';

import styles from './Sidebar.module.scss';
import { datas } from '../../utils/SidebarData';

const cx = classNames.bind(styles);

function Sidebar({ user }) {
    const [lists, setLists] = useState([]);
    const [listName, setListName] = useState('');
    const [reRender, setReRender] = useState(false);
    const deleteList = async (id) => {
        try {
            await axios({
                method: 'DELETE',
                url: `${
                    import.meta.env.VITE_API_BASE_URL
                }/api/nolazzi/lists/${id}`,
                data: {
                    name: listName,
                    user: user._id,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
    const createList = async () => {
        try {
            await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_API_BASE_URL}/api/nolazzi/lists`,
                data: {
                    name: listName,
                    user: user._id,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        async function fetchAPI() {
            try {
                const resLists = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/nolazzi/lists?user=${user._id}`,
                });
                setLists(resLists.data.data.docs);
            } catch (error) {
                console.log(error);
            }
        }
        fetchAPI();
    }, [listName, user._id, reRender]);
    return (
        <Fragment>
            <ul className={cx('sidebar')}>
                {datas.map((data) => (
                    <li
                        key={data.title}
                        className={cx('sidebar-item', 'hover-active')}
                    >
                        <Link
                            style={{
                                display: 'inline-block',
                                width: '100%',
                                textDecoration: 'none',
                            }}
                            to={`${data.to}`}
                        >
                            <span
                                style={{ color: `${data.color}` }}
                                className={cx('icon')}
                            >
                                <FontAwesomeIcon icon={data.icon} />
                            </span>
                            <span
                                style={{ color: `${data.color}` }}
                                className={cx('item-name')}
                            >
                                {data.title}
                            </span>
                        </Link>
                    </li>
                ))}
                <li className={cx('sidebar-item', 'list-box')}>
                    <span style={{ color: `#A569AC` }} className={cx('icon')}>
                        <FontAwesomeIcon icon={faRectangleList} />
                    </span>
                    <span
                        style={{ color: `#A569AC` }}
                        className={cx('item-name')}
                    >
                        Lists
                    </span>
                    <ul className={cx('lists')}>
                        {lists.map((list) => (
                            <li key={list._id} className={cx('list')}>
                                <Link
                                    to={`/list/${list._id}/${list.name}`}
                                    style={{
                                        display: 'inline-block',
                                        width: '100%',
                                        textDecoration: 'none',
                                        color: '#CCCCFF',
                                    }}
                                >
                                    {list.name}
                                </Link>
                                <span
                                    className={cx('list-trash')}
                                    onClick={async () => {
                                        await deleteList(list._id);
                                        setReRender(!reRender);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                            </li>
                        ))}
                        <div className={cx('addBox')}>
                            <input
                                type="text"
                                placeholder="List"
                                maxLength="36"
                                className={cx('inputList')}
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                            />
                            <button
                                className={cx('addBtn')}
                                onClick={async () => {
                                    await createList();
                                    setListName('');
                                }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCirclePlus} />
                                </span>
                            </button>
                        </div>
                    </ul>
                </li>
            </ul>
        </Fragment>
    );
}

export default Sidebar;
