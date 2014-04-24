Paginator
=========

A paginator component.

Properties
----------
- ***totalPages***: the number of total pages
- ***className***: additional top level class name
- ***page***: (default: 1) the current page number (1-based)
- ***radius***: (default: 1) the number of page links (moving out from current page) to show
- ***anchor***: (default: 1) the number of page links (moving out from each end) to show
- ***onChange***: called when the user clicked a page number

Example
---------
    <Paginator page={2} totalPages={12} onChange={funtion(pageNumber) {...}}/>