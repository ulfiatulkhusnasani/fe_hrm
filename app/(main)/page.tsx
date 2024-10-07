'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { addLocale, locale } from 'primereact/api';

// Define chart data and options
const lineData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const lineOptions: ChartOptions<'line'> = {
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }
};

const Dashboard = () => {
    const menu1 = useRef<Menu>(null);
    const [calendarDate, setCalendarDate] = useState<Date | null>(null);

    // Configure the locale for the Calendar
    useEffect(() => {
        addLocale('en', {
            firstDayOfWeek: 1, // Monday as the first day of the week
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            monthNamesShort: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            today: 'Today',
            clear: 'Clear',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Wk'
        });
        locale('en');
    }, []);

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">HADIR</span>
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center" 
                             style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#8FFF7C', borderRadius: '50%' }}>
                            <i className="pi pi-user text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">Lihat selengkapnya</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">LIBUR</span>
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center" 
                             style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#7C96FF', borderRadius: '50%' }}>
                            <i className="pi pi-clock text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">Lihat selengkapnya</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">ALFA</span>
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center" 
                             style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#FA6568', borderRadius: '50%' }}>
                            <i className="pi pi-clock text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">Lihat selengkapnya</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Cuti/izin</span>
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center" 
                             style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#EFE070', borderRadius: '50%' }}>
                            <i className="pi pi-exclamation-circle text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">Lihat selengkapnya</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card mb-0" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>LAPORAN KEHADIRAN BULANAN</h5>
                        <div>
                            <Button
                                type="button"
                                icon="pi pi-ellipsis-v"
                                rounded
                                text
                                className="p-button-plain"
                                onClick={(event) => menu1.current?.toggle(event)}
                            />
                            <Menu
                                ref={menu1}
                                popup
                                model={[
                                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="relative flex-grow" style={{ height: '400px' }}>
                        <Chart
                            type="line"
                            data={lineData}
                            options={lineOptions}
                            style={{ height: '100%', width: '100%' }} // Ensures the chart fills the container
                        />
                    </div>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="col-12 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>KALENDER</h5>
                        <div>
                            <Button
                                type="button"
                                icon="pi pi-ellipsis-v"
                                rounded
                                text
                                className="p-button-plain"
                                onClick={(event) => menu1.current?.toggle(event)}
                            />
                            <Menu
                                ref={menu1}
                                popup
                                model={[
                                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="relative" style={{ width: '100%', height: '400px' }}>
                        <Calendar
                            value={calendarDate}
                            onChange={(e) => {
                                if (e.value !== undefined) {
                                    setCalendarDate(e.value);
                                }
                            }}
                            dateFormat="dd/mm/yy"
                            yearNavigator
                            monthNavigator
                            yearRange="2020:2030"
                            locale="en"
                            inline
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
