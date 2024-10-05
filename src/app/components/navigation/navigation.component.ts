import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @Output() load = new EventEmitter<number>();
  @Input() totalPages: number = 0;

  currentPage: number = 0;

  goToPage(page: number) {
    this.currentPage = page;
    this.load.emit(this.currentPage);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.load.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.load.emit(this.currentPage);
    }
  }
}
