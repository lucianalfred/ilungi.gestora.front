// Página para definir senha (SetupPassword.jsx)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SetupPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Valida token
        axios.get(`/api/auth/validate-setup-token/${token}`)
            .then(response => {
                if (response.data.valid) {
                    setUser(response.data.user);
                } else {
                    setError('Link inválido ou expirado');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Erro ao validar link');
                setLoading(false);
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }
        
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        try {
            const response = await axios.post('/api/auth/setup-password', {
                token,
                password,
                confirmPassword
            });
            
            setMessage(response.data.message);
            setError('');
            
            // Redireciona para login após 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao definir senha');
        }
    };

    if (loading) {
        return <div>Validando link...</div>;
    }

    if (error && !user) {
        return (
            <div className="error-container">
                <h2>Link Inválido</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/request-setup')}>
                    Solicitar Novo Link
                </button>
            </div>
        );
    }

    return (
        <div className="setup-password-container">
            <h2>Definir Senha</h2>
            <p>Olá, <strong>{user?.name}</strong>!</p>
            <p>Por favor, defina sua senha para acessar o sistema.</p>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nova Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                
                <div className="form-group">
                    <label>Confirmar Senha</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                
                <button type="submit" className="submit-btn">
                    Definir Senha
                </button>
            </form>
            
            <div className="password-tips">
                <h4>Dicas para uma senha segura:</h4>
                <ul>
                    <li>Use pelo menos 6 caracteres</li>
                    <li>Combine letras maiúsculas e minúsculas</li>
                    <li>Inclua números e símbolos</li>
                    <li>Não use senhas óbvias como "123456"</li>
                </ul>
            </div>
        </div>
    );
}