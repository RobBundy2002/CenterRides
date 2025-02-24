import React, { useState, useEffect } from 'react';
import database from './firebase';
import { ref, set, onValue, remove } from 'firebase/database';
import './App.css';

const fixedUsername = "CenterChurch";
const fixedPassword = "GoAndMakeDisciples";

function App() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [service, setService] = useState('');
    const [plusOnes, setPlusOnes] = useState(0);
    const [rides, setRides] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const ridesRef = ref(database, 'rides/');
        onValue(ridesRef, (snapshot) => {
            const data = snapshot.val();
            const ridesList = [];
            for (let key in data) {
                ridesList.push({
                    key: key,
                    ...data[key]
                });
            }
            setRides(ridesList);
        });
    }, []);

    const handleLogin = () => {
        if (username === fixedUsername && password === fixedPassword) {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleSubmit = () => {
        const dataRef = ref(database, 'rides/' + phoneNumber);
        set(dataRef, {
            name: name,
            phone: phoneNumber,
            service: service,
            plusOnes: plusOnes,
        })
            .then(() => {
                setName('');
                setPhoneNumber('');
                setService('');
                setPlusOnes(0);
            })
            .catch((error) => {
                console.error('Error saving data:', error);
            });
    };

    const handleClaim = (rideKey) => {
        const rideRef = ref(database, 'rides/' + rideKey);
        remove(rideRef)
            .then(() => {
                console.log('Ride claimed and removed successfully!');
            })
            .catch((error) => {
                console.error('Error removing ride:', error);
            });
    };

    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error">{error}</p>}
            </div>
        );
    }

    const RideInfo = ({ ride }) => {
        const [showPhone, setShowPhone] = useState(false);

        return (
            <li key={ride.key}>
                <strong>{ride.name}</strong> wants to go to
                the <strong>{ride.service}</strong> with {ride.plusOnes} plus one(s).
                <div className="button-container">
                    <button onClick={() => setShowPhone(!showPhone)}>
                        {showPhone ? "Hide" : "Show"} Phone Number
                    </button>
                    {showPhone && <p>Phone: {ride.phone}</p>}
                    <button onClick={() => handleClaim(ride.key)}>
                        Claim & Remove
                    </button>
                </div>
            </li>
        );
    };

    return (
        <div className="app-container">
            <div className="form-container">
                <h1>Sign up for a ride!</h1>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Enter number of plus ones"
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(e.target.value)}
                    min="0"
                />

                <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                >
                    <option value="">Select a time</option>
                    <option value="9:15">9:15</option>
                    <option value="11:00">11:00</option>
                    <option value="4:30">4:30</option>
                </select>

                <button onClick={handleSubmit}>Submit</button>
            </div>
            <h2>People who need rides:</h2>
            <div className="rides-list-container">
                <ul>
                    {rides.length > 0 ? (
                        rides.map((ride) => (
                            <RideInfo key={ride.key} ride={ride}/>
                        ))
                    ) : null}
                </ul>
            </div>
        </div>
    );
}

export default App;
