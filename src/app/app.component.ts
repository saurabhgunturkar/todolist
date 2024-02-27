import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'to-dolist';
  taskDataSource: MatTableDataSource<string> = new MatTableDataSource<string>();
  taskForm: FormGroup;
  isLoading: boolean = true;
  currentImageIndex: number = 0;
  backgroundImages: string[] = [
    'url(https://c4.wallpaperflare.com/wallpaper/792/1013/309/nature-autumn-wallpaper-preview.jpg)',
    'url(https://e0.pxfuel.com/wallpapers/797/734/desktop-wallpaper-gold-sunset-netherlands-spring-flowers-plantation-with-yellow-red-and-pink-tulips-ultra-tv-for-laptop-tablet-and-mobile-phones.jpg)',
    'url(https://c4.wallpaperflare.com/wallpaper/792/1013/309/nature-autumn-wallpaper-preview.jpg)',
    'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTplQdOEUCS_pc76lmCCLLI6RImmVMah4Ofgg&usqp=CAU)',
  ];
  date!: Date;
  editMode: boolean = false;
  editedRowIndex: number = -1;


  constructor(public fb: FormBuilder) {
    this.taskForm = this.fb.group({
      task: ['']
    });
  }

  ngOnInit() {
    this.date = new Date();

    const storedDataString = localStorage.getItem('task');
    if (storedDataString) {
      try {
        this.taskDataSource.data = JSON.parse(storedDataString);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 5000);

  }

  ngOnDestroy() {
    this.taskForm.value.task.clear();
    localStorage.clear();
  }

  submitTask() {
    if (this.taskForm.valid) {
      let newTask = this.taskForm.value.task;
      this.taskDataSource.data.push(newTask);
      console.log('Task added:', newTask);
      this.taskDataSource.data = [...this.taskDataSource.data]; // Trigger data update
      localStorage.setItem('task', JSON.stringify(this.taskDataSource.data)); // Corrected line
      this.taskForm.reset();
    } 
  }

  editTask(index: number) {
    this.editMode = true;
    this.editedRowIndex = index;
    this.taskForm.setValue({
      task: this.taskDataSource.data[index]
    });
  }

  saveTask() {
    if (this.taskForm.valid) {
      let editedTask = this.taskForm.value.task;
      this.taskDataSource.data[this.editedRowIndex] = editedTask;
      this.taskDataSource.data = [...this.taskDataSource.data]; // Trigger data update
      localStorage.setItem('task', JSON.stringify(this.taskDataSource.data));
      this.editMode = false;
      this.editedRowIndex = -1;
      this.taskForm.reset();
    }
  }

  removetodo(index: number) {
    this.taskDataSource.data.splice(index, 1);
    this.taskDataSource.data = [...this.taskDataSource.data]; // Trigger data update
    localStorage.setItem('task', JSON.stringify(this.taskDataSource.data)); //store data again localstorage
  }


}
