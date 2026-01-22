import { Component, inject, ElementRef, viewChild, afterNextRender, effect } from '@angular/core';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-super-admin-view',
  standalone: true,
  template: `
    <div class="space-y-8">
      <h2 class="text-3xl font-bold text-gray-900">Vue Globale Super Admin</h2>
      
      <!-- Stats Globales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart Container -->
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Requêtes par Matière</h3>
          <div #chartContainer class="w-full h-64"></div>
        </div>

        <!-- System Status -->
        <div class="bg-white p-6 rounded-xl shadow-md">
           <h3 class="text-lg font-semibold text-gray-800 mb-4">État du Système</h3>
           <div class="space-y-4">
             <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-blue-100 rounded-full text-blue-600">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                   </div>
                   <div>
                     <p class="font-medium text-gray-900">Admins de Classe</p>
                     <p class="text-sm text-gray-500">12 actifs</p>
                   </div>
                </div>
                <button class="text-sm text-blue-600 font-medium hover:underline">Gérer</button>
             </div>

             <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-purple-100 rounded-full text-purple-600">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                   </div>
                   <div>
                     <p class="font-medium text-gray-900">Volume Total</p>
                     <p class="text-sm text-gray-500">{{ dataService.requests().length }} requêtes traitées</p>
                   </div>
                </div>
                <button class="text-sm text-blue-600 font-medium hover:underline">Rapport</button>
             </div>
           </div>
        </div>
      </div>

      <!-- Quick Actions for Admin Management -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Gestion des Admins</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
             <thead>
               <tr>
                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                 <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-gray-200">
               <tr>
                 <td class="px-6 py-4 text-sm font-medium text-gray-900">Marie Curie</td>
                 <td class="px-6 py-4 text-sm text-gray-500">PROF001</td>
                 <td class="px-6 py-4"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Actif</span></td>
                 <td class="px-6 py-4 text-right text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer">Modifier</td>
               </tr>
               <tr>
                 <td class="px-6 py-4 text-sm font-medium text-gray-900">Albert Einstein</td>
                 <td class="px-6 py-4 text-sm text-gray-500">PROF002</td>
                 <td class="px-6 py-4"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Actif</span></td>
                 <td class="px-6 py-4 text-right text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer">Modifier</td>
               </tr>
             </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class SuperAdminViewComponent {
  dataService = inject(DataService);
  chartContainer = viewChild<ElementRef>('chartContainer');

  constructor() {
    afterNextRender(() => {
      this.drawChart();
    });
    
    // Redraw if data changes
    effect(() => {
        if(this.dataService.requests()) {
            this.drawChart();
        }
    });
  }

  drawChart() {
    const el = this.chartContainer()?.nativeElement;
    if (!el) return;

    // Clear previous chart
    d3.select(el).selectAll('*').remove();

    const data = this.dataService.subjectsStats();
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.name))
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 10])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-0)");

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));

    svg.selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#3b82f6')
      .attr('rx', 4);
  }
}