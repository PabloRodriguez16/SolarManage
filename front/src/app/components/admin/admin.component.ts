import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(private usersService: UsersService) {}

  async ngOnInit(): Promise<void> {
    const response = await this.usersService.getAllUsers();
    console.log(response[0]);

    const employees = document.getElementById('employees') as HTMLElement;

    response.forEach((employee: any) => {
      const employeeCard = document.createElement('div');
      const employeeName = document.createElement('h3');
      const employeeEmail = document.createElement('div');
      const employeePhone = document.createElement('div');
      const employeeRole = document.createElement('div');
      const deleteButton = document.createElement('button');

      deleteButton.textContent = 'Delete';

      employeeName.textContent = employee.name;
      employeeEmail.textContent = employee.email;
      employeePhone.textContent = employee.phone;
      employeeRole.textContent = employee.role;

      // Add styles directly in JavaScript
      employeeCard.style.display = 'flex';
      employeeCard.style.justifyContent = 'space-between';
      employeeCard.style.alignItems = 'center';
      employeeCard.style.border = 'solid 2px #ff9950';
      employeeCard.style.padding = '1em';
      employeeCard.style.margin = '1em';
      employeeCard.style.borderRadius = '0.5rem';

      employeeName.style.flex = '1 1 25%'; // Ajuste de flex para ancho uniforme
      employeeEmail.style.flex = '1 1 25%';
      employeePhone.style.flex = '1 1 25%';
      employeeRole.style.flex = '1 1 25%';

      employeeName.style.whiteSpace = 'nowrap';
      employeeName.style.overflow = 'hidden';
      employeeName.style.textOverflow = 'ellipsis';

      employeeEmail.style.whiteSpace = 'nowrap';
      employeeEmail.style.overflow = 'hidden';
      employeeEmail.style.textOverflow = 'ellipsis';

      employeePhone.style.whiteSpace = 'nowrap';
      employeePhone.style.overflow = 'hidden';
      employeePhone.style.textOverflow = 'ellipsis';

      employeeRole.style.whiteSpace = 'nowrap';
      employeeRole.style.overflow = 'hidden';
      employeeRole.style.textOverflow = 'ellipsis';
      employeeRole.style.fontWeight = 'bold';

      if (employee.role === 'admin') {
        employeeRole.style.color = 'blue';
        employeeCard.style.backgroundColor = '#f7caaa';
      }

      if (employee.role === 'admin') {
        deleteButton.style.backgroundColor = '#f03232';
        deleteButton.style.border = 'solid 2px #d60000';
        deleteButton.style.borderRadius = '0.4rem';
        deleteButton.style.fontSize = '1.1em';
        deleteButton.style.padding = '0.2em 0.6em';
        deleteButton.style.color = 'white';
        deleteButton.style.flex = 'none';
        deleteButton.style.marginLeft = '1em';
        deleteButton.style.transition = '0.3s';
        deleteButton.disabled = true;
      } else {
        deleteButton.style.backgroundColor = '#d60000';
        deleteButton.style.border = 'solid 2px #800020';
        deleteButton.style.borderRadius = '0.4rem';
        deleteButton.style.fontSize = '1.1em';
        deleteButton.style.padding = '0.2em 0.6em';
        deleteButton.style.color = 'white';
        deleteButton.style.flex = 'none';
        deleteButton.style.marginLeft = '1em';
        deleteButton.style.transition = '0.3s';

        deleteButton.addEventListener('mouseover', () => {
          deleteButton.style.transform = 'scale(1.1)';
          deleteButton.style.borderRadius = '0.4rem';
          deleteButton.style.color = '#333';
          deleteButton.style.cursor = 'pointer';
        });

        deleteButton.addEventListener('mouseout', () => {
          deleteButton.style.transform = 'scale(1)';
          deleteButton.style.backgroundColor = '#d60000';
          deleteButton.style.border = 'solid 2px #800020';
          deleteButton.style.borderRadius = '0.4rem';
          deleteButton.style.fontSize = '1.1em';
          deleteButton.style.padding = '0.2em 0.6em';
          deleteButton.style.color = 'white';
          deleteButton.style.flex = 'none';
          deleteButton.style.marginLeft = '1em';
        });

        deleteButton.addEventListener('click', async () => {
          const result = await swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this employee',
            icon: 'warning',
            buttons: ['Cancel', 'Accept'],
            dangerMode: true,
          });

          if (result) {
            await this.usersService.deleteUser(employee.id);
            location.reload();
          }
        });
      }

      employeeCard.appendChild(employeeName);
      employeeCard.appendChild(employeeEmail);
      employeeCard.appendChild(employeePhone);
      employeeCard.appendChild(employeeRole);
      employeeCard.appendChild(deleteButton);

      employees.appendChild(employeeCard);
    });
  }
}
