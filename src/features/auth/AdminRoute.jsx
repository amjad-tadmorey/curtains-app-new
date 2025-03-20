import { useAuth } from '../../context/AuthContext'
import NotAllowed from '../../pages/NotAllowed'
import Spinner from '../../ui/Spinner'

export default function AdminRoute({ children }) {
    const { user, isLoading } = useAuth()

    if (isLoading) return <Spinner />

    if (user.user_metadata.role !== 'admin') return <NotAllowed />
    else return children
}
