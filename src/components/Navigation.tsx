import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  isLoggedIn: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Templates',
      icon: 'pi pi-file',
      items: [
        {
          label: 'View Templates',
          icon: 'pi pi-list',
          command: () => navigate('/templates')
        },
        {
          label: 'Create New Template',
          icon: 'pi pi-plus',
          command: () => navigate('/templates/new')
        }
      ]
    },
    {
      label: 'Forms',
      icon: 'pi pi-clone',
      items: [
        {
          label: 'Submitted Forms',
          icon: 'pi pi-check-circle',
          command: () => navigate('/forms')
        },
        {
          label: 'Draft Forms',
          icon: 'pi pi-pencil',
          command: () => navigate('/forms/drafts')
        },
        {
          label: 'Archived Forms',
          icon: 'pi pi-history',
          command: () => navigate('/forms/archived')
        }
      ]
    },
    {
      label: 'Login',
      icon: 'pi pi-user',
      command: () => navigate('/login'),
      visible: !isLoggedIn
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        // Add logout logic here
        navigate('/login');
      },
      visible: isLoggedIn
    }
  ];

  return <Menubar model={items} className="mb-4" />;
};

export default Navigation; 